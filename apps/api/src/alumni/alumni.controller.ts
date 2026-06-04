import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { AlumniService } from "./alumni.service";

@Controller("alumni")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AlumniController {
  constructor(@Inject(AlumniService) private readonly service: AlumniService) {}

  @Get()
  @RequirePermissions("alumni.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Alumni retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("alumni.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Alumni created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("alumni.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Alumni retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("alumni.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Alumni updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("alumni.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Alumni deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post("convert-from-student/:studentId")
  @RequirePermissions("alumni.convert")
  async convertFromStudent(@Param("studentId") studentId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Student converted to alumni", await this.service.convertFromStudent(studentId, user, getRequestMeta(request)));
  }
}
