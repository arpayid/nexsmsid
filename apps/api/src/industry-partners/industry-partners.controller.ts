import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { IndustryPartnersService } from "./industry-partners.service";

@Controller("industry-partners")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class IndustryPartnersController {
  constructor(@Inject(IndustryPartnersService) private readonly service: IndustryPartnersService) {}

  @Get()
  @RequirePermissions("industry-partners.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Industry partners retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("industry-partners.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Industry partner retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("industry-partners.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Industry partner created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("industry-partners.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Industry partner updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("industry-partners.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Industry partner deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
