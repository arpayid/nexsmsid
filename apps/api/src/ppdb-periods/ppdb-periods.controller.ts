import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PpdbPeriodsService } from "./ppdb-periods.service";

@Controller("ppdb/periods")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PpdbPeriodsController {
  constructor(@Inject(PpdbPeriodsService) private readonly service: PpdbPeriodsService) {}

  @Get()
  @RequirePermissions("ppdb.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("PPDB periods retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("ppdb.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("PPDB period retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("ppdb.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB period created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("ppdb.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB period updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("ppdb.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB period deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
