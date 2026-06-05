import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { CounselingService } from "./counseling.service";

@Controller("counseling")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CounselingController {
  constructor(@Inject(CounselingService) private readonly service: CounselingService) {}

  @Get("cases")
  @RequirePermissions("counseling.view")
  async listCases(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Counseling cases retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("cases")
  @RequirePermissions("counseling.create")
  async createCase(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling case created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get("cases/:id")
  @RequirePermissions("counseling.view")
  async getCase(@Param("id") id: string) {
    return apiSuccess("Counseling case retrieved", await this.service.findById(id));
  }

  @Patch("cases/:id")
  @RequirePermissions("counseling.update")
  async updateCase(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling case updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete("cases/:id")
  @RequirePermissions("counseling.delete")
  async deleteCase(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling case deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post("cases/:id/close")
  @RequirePermissions("counseling.update")
  async closeCase(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling case closed", await this.service.close(id, body, user, getRequestMeta(request)));
  }

  @Post("cases/:id/reopen")
  @RequirePermissions("counseling.update")
  async reopenCase(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling case reopened", await this.service.reopen(id, user, getRequestMeta(request)));
  }

  @Get("cases/:id/notes")
  @RequirePermissions("counseling.view")
  async listNotes(@Param("id") id: string) {
    return apiSuccess("Counseling notes retrieved", await this.service.listNotes(id));
  }

  @Post("cases/:id/notes")
  @RequirePermissions("counseling.update")
  async createNote(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Counseling note created", await this.service.createNote(id, body, user, getRequestMeta(request)));
  }
}
