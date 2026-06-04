import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { RolesService } from "./roles.service";

@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
  constructor(@Inject(RolesService) private readonly rolesService: RolesService) {}

  @Get()
  @RequirePermissions("roles.view")
  async list() {
    const result = await this.rolesService.list();
    return apiSuccess("Roles retrieved", result.items, { total: result.total });
  }

  @Post()
  @RequirePermissions("roles.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("Role created", await this.rolesService.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("roles.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Role retrieved", await this.rolesService.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("roles.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("Role updated", await this.rolesService.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("roles.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("Role deleted", await this.rolesService.delete(id, user, getRequestMeta(request)));
  }
}
