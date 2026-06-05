import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { AuthenticatedUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { TeacherPortalService } from "./teacher-portal.service";

@Controller("teacher-portal")
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions("teacher-portal.view")
export class TeacherPortalController {
  constructor(@Inject(TeacherPortalService) private readonly service: TeacherPortalService) {}

  @Get("summary")
  async summary(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Teacher portal summary retrieved", await this.service.getSummary(user.id));
  }

  @Get("teaching-assignments")
  async teachingAssignments(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Teaching assignments retrieved", await this.service.listTeachingAssignments(user.id));
  }

  @Get("schedules")
  async schedules(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Schedules retrieved", await this.service.listSchedules(user.id));
  }

  @Get("attendance-sessions")
  async attendanceSessions(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(100, Number(limit))) : 20;
    return apiSuccess("Attendance sessions retrieved", await this.service.listAttendanceSessions(user.id, Number.isFinite(parsed) ? parsed : 20));
  }

  @Get("assessments")
  async assessments(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Assessments retrieved", await this.service.listAssessments(user.id));
  }

  @Get("notifications")
  async notifications(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(100, Number(limit))) : 20;
    return apiSuccess("Notifications retrieved", await this.service.listNotifications(user.id, Number.isFinite(parsed) ? parsed : 20));
  }
}
