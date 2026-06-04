import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Queue, Worker, type ConnectionOptions } from "bullmq";

import { PrismaService } from "../database/prisma.service";

type ReportQueuePayload = { reportJobId: string };

@Injectable()
export class ReportQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReportQueueService.name);
  private readonly connection: ConnectionOptions;
  private readonly queue: Queue<ReportQueuePayload>;
  private worker?: Worker<ReportQueuePayload>;

  constructor(
    @Inject(ConfigService) configService: ConfigService,
    @Inject(PrismaService) private readonly prisma: PrismaService
  ) {
    this.connection = this.redisConnection(configService.get<string>("REDIS_URL") ?? "redis://localhost:6379");
    this.queue = new Queue<ReportQueuePayload>("reportQueue", { connection: this.connection });
  }

  onModuleInit() {
    this.worker = new Worker<ReportQueuePayload>(
      "reportQueue",
      async (job) => {
        await this.processReportJob(job.data.reportJobId);
      },
      { connection: this.connection, concurrency: 1 }
    );

    this.worker.on("error", (error) => this.logger.warn(`Report queue worker error: ${error.message}`));
  }

  async onModuleDestroy() {
    await this.worker?.close();
    await this.queue.close();
  }

  async enqueueReportJob(reportJobId: string) {
    try {
      await this.queue.add("generate-report", { reportJobId }, { jobId: reportJobId, removeOnComplete: true, removeOnFail: 100 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown queue error";
      this.logger.warn(`Unable to enqueue report job ${reportJobId}: ${message}. Processing directly.`);
    }

    await this.processReportJob(reportJobId);
  }

  async removeReportJob(reportJobId: string) {
    try {
      const job = await this.queue.getJob(reportJobId);
      await job?.remove();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown queue error";
      this.logger.warn(`Unable to remove report job ${reportJobId}: ${message}`);
    }
  }

  async processReportJob(reportJobId: string) {
    const claimed = await this.prisma.reportJob.updateMany({
      where: { id: reportJobId, status: "PENDING" },
      data: { status: "PROCESSING", startedAt: new Date(), errorMessage: null }
    });

    if (claimed.count === 0) return;

    const reportJob = await this.prisma.reportJob.findUnique({ where: { id: reportJobId } });
    if (!reportJob) return;

    try {
      const rowCount = await this.estimateRowCount(reportJob.type);
      const fileName = `${reportJob.type.toLowerCase()}-${reportJob.id}.${reportJob.format.toLowerCase()}`;
      const fileUrl = `/exports/${fileName}`;

      await this.prisma.$transaction([
        this.prisma.reportJob.update({
          where: { id: reportJob.id },
          data: { status: "COMPLETED", completedAt: new Date(), resultUrl: fileUrl, errorMessage: null }
        }),
        this.prisma.exportHistory.create({
          data: {
            reportJobId: reportJob.id,
            entity: reportJob.type,
            format: reportJob.format,
            fileName,
            fileUrl,
            rowCount,
            requestedById: reportJob.requestedById
          }
        })
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown report processing error";
      await this.prisma.reportJob.update({ where: { id: reportJob.id }, data: { status: "FAILED", completedAt: new Date(), errorMessage: message } });
      throw error;
    }
  }

  private redisConnection(redisUrl: string): ConnectionOptions {
    const url = new URL(redisUrl);
    const db = Number(url.pathname.replace("/", ""));
    return {
      host: url.hostname,
      port: Number(url.port || 6379),
      username: url.username ? decodeURIComponent(url.username) : undefined,
      password: url.password ? decodeURIComponent(url.password) : undefined,
      db: Number.isNaN(db) ? undefined : db,
      tls: url.protocol === "rediss:" ? {} : undefined
    };
  }

  private async estimateRowCount(type: string) {
    switch (type.toUpperCase()) {
      case "STUDENTS":
        return this.prisma.student.count({ where: { deletedAt: null } });
      case "FINANCE":
        return this.prisma.invoice.count({ where: { deletedAt: null } });
      case "PPDB":
        return this.prisma.ppdbRegistration.count();
      case "BKK":
        return this.prisma.jobVacancy.count({ where: { deletedAt: null } });
      default:
        return 0;
    }
  }
}
