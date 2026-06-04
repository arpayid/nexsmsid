import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { GuardiansService } from "./guardians.service";

@Controller("guardians")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class GuardiansController {
  constructor(@Inject(GuardiansService) private readonly guardiansService: GuardiansService) {}

  @Get()
  @RequirePermissions("guardians.view")
  async list(@Query() query: unknown) {
    const result = await this.guardiansService.list(query);
    return apiSuccess("Guardians retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get(":id")
  @RequirePermissions("guardians.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Guardian retrieved", await this.guardiansService.findById(id));
  }

  @Post()
  @RequirePermissions("guardians.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian created",
      await this.guardiansService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("guardians.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian updated",
      await this.guardiansService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("guardians.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian deleted",
      await this.guardiansService.delete(id, user, getRequestMeta(request))
    );
  }
}
