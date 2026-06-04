import { Controller, Get, Inject, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { FinanceDashboardService } from "./finance-dashboard.service";

@Controller("finance")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FinanceDashboardController {
  constructor(@Inject(FinanceDashboardService) private readonly service: FinanceDashboardService) {}

  @Get("summary")
  @RequirePermissions("finance.view")
  async summary() {
    return apiSuccess("Finance summary retrieved", await this.service.summary());
  }

  @Get("cashflow")
  @RequirePermissions("finance.view")
  async cashflow() {
    return apiSuccess("Finance cashflow retrieved", await this.service.cashflow());
  }

  @Get("outstanding")
  @RequirePermissions("finance.view")
  async outstanding() {
    return apiSuccess("Outstanding invoices retrieved", await this.service.outstanding());
  }
}
