import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { InternshipLogsService } from "./internship-logs.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InternshipLogsController {
  constructor(@Inject(InternshipLogsService) private readonly service: InternshipLogsService) {}

  @Get("internships/:id/logs")
  @RequirePermissions("internship-logs.view")
  async list(@Param("id") id: string, @Query() query: unknown) {
    const result = await this.service.list(id, query);
    return apiSuccess("Internship logs retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("internships/:id/logs")
  @RequirePermissions("internship-logs.create")
  async create(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship log created", await this.service.create(id, body, user, getRequestMeta(request)));
  }

  @Patch("internship-logs/:logId")
  @RequirePermissions("internship-logs.update")
  async update(@Param("logId") logId: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship log updated", await this.service.update(logId, body, user, getRequestMeta(request)));
  }

  @Post("internship-logs/:logId/approve")
  @RequirePermissions("internship-logs.approve")
  async approve(@Param("logId") logId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship log approved", await this.service.approve(logId, user, getRequestMeta(request)));
  }

  @Post("internship-logs/:logId/reject")
  @RequirePermissions("internship-logs.reject")
  async reject(@Param("logId") logId: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship log rejected", await this.service.reject(logId, body, user, getRequestMeta(request)));
  }
}
