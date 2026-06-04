import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { ReportJobsModule } from "../report-jobs/report-jobs.module";
import { ReportCenterController } from "./report-center.controller";
import { ReportCenterService } from "./report-center.service";

@Module({ imports: [AuthModule, DatabaseModule, ReportJobsModule], controllers: [ReportCenterController], providers: [ReportCenterService] })
export class ReportCenterModule {}
