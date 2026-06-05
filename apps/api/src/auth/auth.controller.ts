import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from "@nestjs/common";

import { apiSuccess } from "../common/api-response";
import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "./auth.types";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { RequirePermissions } from "./decorators/require-permissions.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { PermissionGuard } from "./guards/permission.guard";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() body: unknown, @Req() request: RequestWithUser) {
    return apiSuccess("Login successful", await this.authService.login(body, getRequestMeta(request)));
  }

  @Post("refresh")
  async refresh(@Body() body: unknown, @Req() request: RequestWithUser) {
    return apiSuccess("Token refreshed", await this.authService.refresh(body, getRequestMeta(request)));
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: unknown,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("Logout successful", await this.authService.logout(user, body, getRequestMeta(request)));
  }

  @Post("logout-all")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("auth.logout-all")
  async logoutAll(@CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Logged out from all devices", await this.authService.logoutAll(user, getRequestMeta(request)));
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("auth.change-password")
  async changePassword(@CurrentUser() user: AuthenticatedUser, @Body() body: unknown, @Req() request: RequestWithUser) {
    return apiSuccess("Password changed successfully", await this.authService.changePassword(user, body, getRequestMeta(request)));
  }

  @Get("login-history")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("auth.login-history")
  async getLoginHistory(@CurrentUser() user: AuthenticatedUser, @Query() query: unknown) {
    return apiSuccess("Login history retrieved", await this.authService.getLoginHistory(user, query));
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Authenticated user retrieved", await this.authService.me(user));
  }
}
