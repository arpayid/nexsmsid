import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ReportJobsService } from "../report-jobs/report-jobs.service";
import { ReportCenterService } from "./report-center.service";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ReportCenterController {
  constructor(
    @Inject(ReportCenterService) private readonly service: ReportCenterService,
    @Inject(ReportJobsService) private readonly reportJobsService: ReportJobsService
  ) {}

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
}
