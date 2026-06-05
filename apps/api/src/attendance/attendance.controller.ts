import { BadRequestException, Body, Controller, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PrintDocumentService } from "../pdf/print-document.service";
import { AttendanceService } from "./attendance.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AttendanceController {
  constructor(
    @Inject(AttendanceService) private readonly service: AttendanceService,
    @Inject(PrintDocumentService) private readonly printService: PrintDocumentService
  ) {}

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

  @Get("attendance/classrooms/:classroomId/recap.pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("attendance.print")
  async downloadClassroomRecap(
    @Param("classroomId") classroomId: string,
    @Query("startDate") startDate: string | undefined,
    @Query("endDate") endDate: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Res() res: Response
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException("startDate and endDate are required (ISO YYYY-MM-DD)");
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException("Invalid startDate or endDate");
    }
    const buffer = await this.printService.renderAttendanceRecap(classroomId, start, end);
    await this.printService.logPrint(
      "attendance.recap.print",
      "classroom",
      classroomId,
      user,
      getRequestMeta(request),
      { startDate: start.toISOString(), endDate: end.toISOString() }
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="attendance-recap-${classroomId}.pdf"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
