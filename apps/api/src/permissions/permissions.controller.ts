import { Controller, Get, Inject, Param, UseGuards } from "@nestjs/common";

import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PermissionsService } from "./permissions.service";

@Controller("permissions")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PermissionsController {
  constructor(@Inject(PermissionsService) private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermissions("permissions.view")
  async list() {
    const result = await this.permissionsService.list();
    return apiSuccess("Permissions retrieved", result.items, { total: result.total });
  }

  @Get(":id")
  @RequirePermissions("permissions.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Permission retrieved", await this.permissionsService.findById(id));
  }
}
