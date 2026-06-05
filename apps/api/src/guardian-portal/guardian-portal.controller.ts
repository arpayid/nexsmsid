import { Controller, Get, Inject, Param, Query, UseGuards } from "@nestjs/common";

import { AuthenticatedUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { GuardianPortalService } from "./guardian-portal.service";

@Controller("guardian-portal")
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions("guardian-portal.view")
export class GuardianPortalController {
  constructor(@Inject(GuardianPortalService) private readonly service: GuardianPortalService) {}

  @Get("summary")
  async summary(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Guardian portal summary retrieved", await this.service.getSummary(user.id));
  }

  @Get("children")
  async children(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Children retrieved", await this.service.listChildren(user.id));
  }

  @Get("children/:studentId/attendance")
  async childAttendance(@CurrentUser() user: AuthenticatedUser, @Param("studentId") studentId: string, @Query("limit") limit?: string) {
    const parsed = limit ? Math.max(1, Math.min(200, Number(limit))) : 30;
    return apiSuccess("Child attendance retrieved", await this.service.getChildAttendance(user.id, studentId, Number.isFinite(parsed) ? parsed : 30));
  }

  @Get("children/:studentId/grades")
  async childGrades(@CurrentUser() user: AuthenticatedUser, @Param("studentId") studentId: string) {
    return apiSuccess("Child grades retrieved", await this.service.getChildGrades(user.id, studentId));
  }

  @Get("children/:studentId/invoices")
  async childInvoices(@CurrentUser() user: AuthenticatedUser, @Param("studentId") studentId: string) {
    return apiSuccess("Child invoices retrieved", await this.service.getChildInvoices(user.id, studentId));
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
