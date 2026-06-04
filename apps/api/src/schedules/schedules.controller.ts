import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { SchedulesService } from "./schedules.service";

@Controller("schedules")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SchedulesController {
  constructor(@Inject(SchedulesService) private readonly service: SchedulesService) {}

  @Get()
  @RequirePermissions("schedules.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Schedules retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get("classroom/:classroomId")
  @RequirePermissions("schedules.view")
  async findByClassroom(@Param("classroomId") classroomId: string) {
    return apiSuccess("Schedules retrieved", await this.service.findByClassroom(classroomId));
  }

  @Get("teacher/:teacherId")
  @RequirePermissions("schedules.view")
  async findByTeacher(@Param("teacherId") teacherId: string) {
    return apiSuccess("Schedules retrieved", await this.service.findByTeacher(teacherId));
  }

  @Get(":id")
  @RequirePermissions("schedules.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Schedule retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("schedules.manage")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Schedule created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("schedules.manage")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Schedule updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("schedules.manage")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Schedule deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
