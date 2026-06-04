import { Module } from "@nestjs/common";

import { AuditModule } from "../audit/audit.module";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { ReportJobsController } from "./report-jobs.controller";
import { ReportJobsService } from "./report-jobs.service";
import { ReportQueueService } from "./report-queue.service";

@Module({ imports: [AuthModule, DatabaseModule, AuditModule], controllers: [ReportJobsController], providers: [ReportJobsService, ReportQueueService], exports: [ReportJobsService] })
export class ReportJobsModule {}
