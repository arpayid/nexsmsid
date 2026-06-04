import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser, RequestMeta } from "../auth/auth.types";
import { parseWithSchema } from "../common/validation";
import { PrismaService } from "../database/prisma.service";
import { generateReportSchema, reportJobListQuerySchema } from "./report-jobs.dto";
import { ReportQueueService } from "./report-queue.service";

@Injectable()
export class ReportJobsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly auditService: AuditService,
    @Inject(ReportQueueService) private readonly reportQueue: ReportQueueService
  ) {}

  async list(query: unknown) {
    const params = parseWithSchema(reportJobListQuerySchema, query);
    const where: Prisma.ReportJobWhereInput = {};
    if (params.status) where.status = params.status as never;
    if (params.type) where.type = params.type;
    if (params.search) {
      where.OR = [
        { type: { contains: params.search, mode: "insensitive" } },
        { title: { contains: params.search, mode: "insensitive" } }
      ];
    }

    const skip = (params.page - 1) * params.limit;
    const [items, total] = await Promise.all([
      this.prisma.reportJob.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" }, include: this.includeRelations() }),
      this.prisma.reportJob.count({ where })
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async findById(id: string) {
    const item = await this.prisma.reportJob.findUnique({ where: { id }, include: this.includeRelations() });
    if (!item) throw new NotFoundException("Report job not found");
    return item;
  }

  async generate(input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const data = parseWithSchema(generateReportSchema, input);
    const item = await this.prisma.reportJob.create({
      data: {
        type: data.type.toUpperCase(),
        title: data.title || `${data.type.toUpperCase()} Report`,
        format: data.format,
        status: "PENDING",
        parameters: data.parameters === undefined ? undefined : (data.parameters as Prisma.InputJsonValue),
        requestedById: actor.id
      }
    });

    await this.auditService.record({ ...meta, actorId: actor.id, action: "report.generate", entity: "report_job", entityId: item.id, metadata: { type: item.type, format: item.format } });
    await this.reportQueue.enqueueReportJob(item.id);
    return this.findById(item.id);
  }

  async cancel(id: string, actor: AuthenticatedUser, meta: RequestMeta) {
    const existing = await this.findById(id);
    if (["COMPLETED", "FAILED", "CANCELLED"].includes(existing.status)) throw new BadRequestException("Only pending or processing report jobs can be cancelled");

    await this.reportQueue.removeReportJob(id);
    const item = await this.prisma.reportJob.update({ where: { id }, data: { status: "CANCELLED", completedAt: new Date() }, include: this.includeRelations() });
    await this.auditService.record({ ...meta, actorId: actor.id, action: "report.cancel", entity: "report_job", entityId: id, metadata: {} });
    return item;
  }

  private includeRelations() {
    return {
      requestedBy: { select: { id: true, email: true, name: true } },
      exportHistories: { orderBy: { createdAt: "desc" as const }, take: 3 }
    };
  }
}
