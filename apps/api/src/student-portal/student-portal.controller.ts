import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";

import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { StudentPortalService } from "./student-portal.service";

@Controller("student-portal")
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions("student-portal.view")
export class StudentPortalController {
  constructor(@Inject(StudentPortalService) private readonly service: StudentPortalService) {}

  @Get("summary")
  async summary(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Student portal summary retrieved", await this.service.getSummary(user.id));
  }

  @Get("profile")
  async profile(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Profile retrieved", await this.service.getProfile(user.id));
  }

  @Get("schedules")
  async schedules(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Schedules retrieved", await this.service.listSchedules(user.id));
  }

  @Get("attendance")
  async attendance(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(200, Number(limit))) : 30;
    return apiSuccess("Attendance retrieved", await this.service.listAttendance(user.id, Number.isFinite(parsed) ? parsed : 30));
  }

  @Get("grades")
  async grades(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Grades retrieved", await this.service.listGrades(user.id));
  }

  @Get("invoices")
  async invoices(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Invoices retrieved", await this.service.listInvoices(user.id));
  }

  @Get("announcements")
  async announcements(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(50, Number(limit))) : 10;
    return apiSuccess("Announcements retrieved", await this.service.listAnnouncements(user.id, Number.isFinite(parsed) ? parsed : 10));
  }

  @Get("notifications")
  async notifications(@CurrentUser() user: AuthenticatedUser, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(100, Number(limit))) : 20;
    return apiSuccess("Notifications retrieved", await this.service.listNotifications(user.id, Number.isFinite(parsed) ? parsed : 20));
  }
}
