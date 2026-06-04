import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PpdbDashboardService } from "./ppdb-dashboard.service";

@Controller("ppdb")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PpdbDashboardController {
  constructor(@Inject(PpdbDashboardService) private readonly service: PpdbDashboardService) {}

  @Get("summary")
  @RequirePermissions("ppdb.view")
  async summary() {
    return apiSuccess("PPDB summary retrieved", await this.service.summary());
  }

  @Get("status-chart")
  @RequirePermissions("ppdb.view")
  async statusChart() {
    return apiSuccess("PPDB status chart retrieved", await this.service.statusChart());
  }
}
