import { Body, Controller, Get, Inject, Patch, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { SchoolProfileService } from "./school-profile.service";

@Controller("school-profile")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SchoolProfileController {
  constructor(@Inject(SchoolProfileService) private readonly schoolProfileService: SchoolProfileService) {}

  @Get()
  @RequirePermissions("school-profile.view")
  async get() {
    return apiSuccess("School profile retrieved", await this.schoolProfileService.get());
  }

  @Patch()
  @RequirePermissions("school-profile.update")
  async update(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess("School profile updated", await this.schoolProfileService.update(body, user, getRequestMeta(request)));
  }
}
