import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";

import { apiSuccess } from "../common/api-response";
import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "./auth.types";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

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

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Authenticated user retrieved", await this.authService.me(user));
  }
}
