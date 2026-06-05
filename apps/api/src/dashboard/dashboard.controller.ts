import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermissions("dashboard.view")
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly dashboardService: DashboardService) {}

  @Get("summary")
  async getSummary() {
    return apiSuccess("Dashboard summary retrieved", await this.dashboardService.getSummary());
  }

  @Get("user-role-summary")
  async getUserRoleSummary() {
    return apiSuccess("Dashboard user role summary retrieved", await this.dashboardService.getUserRoleSummary());
  }

  @Get("recent-activities")
  async getRecentActivities() {
    return apiSuccess("Dashboard recent activities retrieved", await this.dashboardService.getRecentActivities());
  }

  @Get("system-status")
  async getSystemStatus() {
    return apiSuccess("Dashboard system status retrieved", await this.dashboardService.getSystemStatus());
  }

  // Phase 10.5 — Dashboard Enhancement
  @Get("overview")
  async getOverview() {
    return apiSuccess("Dashboard overview retrieved", await this.dashboardService.getOverview());
  }

  @Get("academic-summary")
  async getAcademicSummary() {
    return apiSuccess("Dashboard academic summary retrieved", await this.dashboardService.getAcademicSummary());
  }

  @Get("finance-summary")
  async getFinanceSummary() {
    return apiSuccess("Dashboard finance summary retrieved", await this.dashboardService.getFinanceSummary());
  }

  @Get("ppdb-summary")
  async getPpdbSummary() {
    return apiSuccess("Dashboard PPDB summary retrieved", await this.dashboardService.getPpdbSummary());
  }

  @Get("people-summary")
  async getPeopleSummary() {
    return apiSuccess("Dashboard people summary retrieved", await this.dashboardService.getPeopleSummary());
  }

  @Get("activity-feed")
  async getActivityFeed() {
    return apiSuccess("Dashboard activity feed retrieved", await this.dashboardService.getActivityFeed());
  }

  @Get("quick-alerts")
  async getQuickAlerts() {
    return apiSuccess("Dashboard quick alerts retrieved", await this.dashboardService.getQuickAlerts());
  }
}
