import { Body, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { BaseMasterDataService } from "./base-master-data.service";

@UseGuards(JwtAuthGuard, PermissionGuard)
export abstract class MasterDataController {
  protected constructor(
    private readonly resourceLabel: string,
    private readonly service: BaseMasterDataService<any, any>
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("master-data.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess(`${this.resourceLabel} retrieved`, result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit
    });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("master-data.view")
  async findById(@Param("id") id: string) {
    return apiSuccess(`${this.resourceLabel} retrieved`, await this.service.findById(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("master-data.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(`${this.resourceLabel} created`, await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("master-data.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(`${this.resourceLabel} updated`, await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @RequirePermissions("master-data.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(`${this.resourceLabel} deleted`, await this.service.delete(id, user, getRequestMeta(request)));
  }
}
