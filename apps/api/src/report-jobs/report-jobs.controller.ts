import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ReportJobsService } from "./report-jobs.service";

@Controller("report-jobs")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ReportJobsController {
  constructor(@Inject(ReportJobsService) private readonly service: ReportJobsService) {}

  @Get()
  @RequirePermissions("report-jobs.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Report jobs retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("report-jobs.create")
  async generate(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Report job generated", await this.service.generate(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("report-jobs.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Report job retrieved", await this.service.findById(id));
  }

  @Post(":id/cancel")
  @RequirePermissions("report-jobs.cancel")
  async cancel(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Report job cancelled", await this.service.cancel(id, user, getRequestMeta(request)));
  }
}
