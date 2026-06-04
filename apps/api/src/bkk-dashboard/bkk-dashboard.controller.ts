import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { BkkDashboardService } from "./bkk-dashboard.service";

@Controller("bkk")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class BkkDashboardController {
  constructor(@Inject(BkkDashboardService) private readonly service: BkkDashboardService) {}

  @Get("summary")
  @RequirePermissions("bkk.view")
  async summary() {
    return apiSuccess("BKK summary retrieved", await this.service.summary());
  }

  @Get("job-status-chart")
  @RequirePermissions("bkk.view")
  async jobStatusChart() {
    return apiSuccess("BKK job status chart retrieved", await this.service.jobStatusChart());
  }

  @Get("alumni-status-chart")
  @RequirePermissions("bkk.view")
  async alumniStatusChart() {
    return apiSuccess("BKK alumni status chart retrieved", await this.service.alumniStatusChart());
  }
}
