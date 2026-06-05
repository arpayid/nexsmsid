import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions("users.view")
  async list() {
    const result = await this.usersService.list();
    return apiSuccess("Users retrieved", result.items, { total: result.total });
  }

  @Post()
  @RequirePermissions("users.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User created", await this.usersService.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("users.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("User retrieved", await this.usersService.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("users.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User updated", await this.usersService.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("users.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User deleted", await this.usersService.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/reset-password")
  @RequirePermissions("users.reset-password")
  async resetPassword(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User password reset successfully", await this.usersService.resetPassword(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/unlock")
  @RequirePermissions("users.unlock")
  async unlock(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User unlocked successfully", await this.usersService.unlockUser(id, user, getRequestMeta(request)));
  }

  @Post(":id/force-change-password")
  @RequirePermissions("users.force-change-password")
  async forceChangePassword(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("User force change password updated", await this.usersService.forceChangePassword(id, body, user, getRequestMeta(request)));
  }
}
