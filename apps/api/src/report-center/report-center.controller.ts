import { Body, Controller, Get, Inject, Param, Post, Req, Res, UseGuards, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ReportJobsService } from "../report-jobs/report-jobs.service";
import { ReportCenterService } from "./report-center.service";
import { PrismaService } from "../database/prisma.service";
import { AuditService } from "../audit/audit.service";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ReportCenterController {
  constructor(
    @Inject(ReportCenterService) private readonly service: ReportCenterService,
    @Inject(ReportJobsService) private readonly reportJobsService: ReportJobsService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
  ) {}

  @Get("types")
  @RequirePermissions("reports.view")
  async types() {
    return apiSuccess("Report types retrieved", await this.service.getReportTypes());
  }

  @Get("summary")
  @RequirePermissions("reports.view")
  async summary() {
    return apiSuccess("Report center summary retrieved", await this.service.summary());
  }

  @Post("generate")
  @RequirePermissions("reports.generate")
  async generate(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Report generated", await this.reportJobsService.generate(body, user, getRequestMeta(request)));
  }

  @Get("download/:reportJobId")
  @RequirePermissions("reports.download")
  async download(
    @Param("reportJobId") reportJobId: string, 
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Res() res: Response
  ) {
    const job = await this.prisma.reportJob.findUnique({ where: { id: reportJobId } });
    if (!job) throw new NotFoundException("Report job not found");
    if (job.status !== "COMPLETED") throw new ForbiddenException("Report is not ready for download");
    
    // Permission check: only owner or super-admin can download? 
    // The user requested: "User tanpa reports.download atau reports.export mendapat 403"
    // Already handled by @RequirePermissions("reports.download")
    
    const fileName = `${job.type.toLowerCase()}-${job.id}.${job.format.toLowerCase()}`;
    const filePath = path.join(process.cwd(), "storage", "reports", fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException("Report file not found on server");
    }

    await this.audit.record({
      actorId: user.id,
      action: "report.download",
      entity: "ReportJob",
      entityId: job.id,
      metadata: { type: job.type, format: job.format },
      ...getRequestMeta(request)
    });

    res.download(filePath, fileName);
  }
}
