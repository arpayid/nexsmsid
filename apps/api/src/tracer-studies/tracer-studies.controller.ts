import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { TracerStudiesService } from "./tracer-studies.service";

@Controller("tracer-studies")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TracerStudiesController {
  constructor(@Inject(TracerStudiesService) private readonly service: TracerStudiesService) {}

  @Get()
  @RequirePermissions("tracer-studies.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Tracer studies retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("tracer-studies.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Tracer study created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("tracer-studies.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Tracer study retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("tracer-studies.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Tracer study updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("tracer-studies.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Tracer study deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
