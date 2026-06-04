import { Controller, Get, Inject, Param, Query, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ExportHistoryService } from "./export-history.service";

@Controller("export-history")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ExportHistoryController {
  constructor(@Inject(ExportHistoryService) private readonly service: ExportHistoryService) {}

  @Get()
  @RequirePermissions("export-history.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Export history retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("export-history.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Export history item retrieved", await this.service.findById(id));
  }
}
