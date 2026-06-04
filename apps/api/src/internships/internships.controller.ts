import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { InternshipsService } from "./internships.service";

@Controller("internships")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InternshipsController {
  constructor(@Inject(InternshipsService) private readonly service: InternshipsService) {}

  @Get()
  @RequirePermissions("internships.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Internships retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("internships.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Internship retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("internships.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("internships.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("internships.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/start")
  @RequirePermissions("internships.start")
  async start(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship started", await this.service.start(id, user, getRequestMeta(request)));
  }

  @Post(":id/complete")
  @RequirePermissions("internships.complete")
  async complete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship completed", await this.service.complete(id, user, getRequestMeta(request)));
  }

  @Post(":id/cancel")
  @RequirePermissions("internships.cancel")
  async cancel(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship cancelled", await this.service.cancel(id, user, getRequestMeta(request)));
  }

  @Post(":id/score")
  @RequirePermissions("internships.score")
  async score(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Internship scored", await this.service.score(id, body, user, getRequestMeta(request)));
  }
}
