import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { AuditModule } from "../audit/audit.module";
import { ReportEngineModule } from "../report-engine/report-engine.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { ReportJobsController } from "./report-jobs.controller";
import { ReportJobsService } from "./report-jobs.service";
import { ReportQueueService } from "./report-queue.service";

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    AuditModule,
    ReportEngineModule,
    NotificationsModule,
  ],
  controllers: [ReportJobsController],
  providers: [ReportJobsService, ReportQueueService],
  exports: [ReportJobsService],
})
export class ReportJobsModule {}

