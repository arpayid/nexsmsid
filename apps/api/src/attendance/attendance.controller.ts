import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { AttendanceService } from "./attendance.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AttendanceController {
  constructor(@Inject(AttendanceService) private readonly service: AttendanceService) {}

  @Get("attendance/sessions")
  @RequirePermissions("attendance.view")
  async listSessions(@Query() query: unknown) {
    const result = await this.service.listSessions(query);
    return apiSuccess("Attendance sessions retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get("attendance/sessions/:id")
  @RequirePermissions("attendance.view")
  async findSessionById(@Param("id") id: string) {
    return apiSuccess("Attendance session retrieved", await this.service.findSessionById(id));
  }

  @Post("attendance/sessions")
  @RequirePermissions("attendance.record")
  async createSession(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Attendance session created", await this.service.createSession(body, user, getRequestMeta(request)));
  }

  @Patch("attendance/sessions/:id")
  @RequirePermissions("attendance.update")
  async updateSession(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Attendance session updated", await this.service.updateSession(id, body, user, getRequestMeta(request)));
  }

  @Post("attendance/sessions/:id/records")
  @RequirePermissions("attendance.record")
  async recordAttendance(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Attendance recorded", await this.service.recordAttendance(id, body, user, getRequestMeta(request)));
  }

  @Get("attendance/students/:studentId/summary")
  @RequirePermissions("attendance.view")
  async getStudentSummary(@Param("studentId") studentId: string) {
    return apiSuccess("Attendance summary retrieved", await this.service.getStudentSummary(studentId));
  }

  @Get("attendance/classrooms/:classroomId/summary")
  @RequirePermissions("attendance.view")
  async getClassroomSummary(@Param("classroomId") classroomId: string) {
    return apiSuccess("Attendance summary retrieved", await this.service.getClassroomSummary(classroomId));
  }
}
