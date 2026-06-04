import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { JobApplicationsService } from "./job-applications.service";

@Controller("job-applications")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class JobApplicationsController {
  constructor(@Inject(JobApplicationsService) private readonly service: JobApplicationsService) {}

  @Get()
  @RequirePermissions("job-applications.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Job applications retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("job-applications.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Job application retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("job-applications.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job application updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/review")
  @RequirePermissions("job-applications.review")
  async review(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job application reviewed", await this.service.review(id, user, getRequestMeta(request)));
  }

  @Post(":id/accept")
  @RequirePermissions("job-applications.accept")
  async accept(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job application accepted", await this.service.accept(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/reject")
  @RequirePermissions("job-applications.reject")
  async reject(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job application rejected", await this.service.reject(id, body, user, getRequestMeta(request)));
  }
}
