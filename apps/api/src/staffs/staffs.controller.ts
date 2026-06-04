import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { StaffsService } from "./staffs.service";

@Controller("staffs")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StaffsController {
  constructor(@Inject(StaffsService) private readonly staffsService: StaffsService) {}

  @Get()
  @RequirePermissions("staffs.view")
  async list(@Query() query: unknown) {
    const result = await this.staffsService.list(query);
    return apiSuccess("Staffs retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get(":id")
  @RequirePermissions("staffs.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Staff retrieved", await this.staffsService.findById(id));
  }

  @Post()
  @RequirePermissions("staffs.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff created",
      await this.staffsService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("staffs.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff updated",
      await this.staffsService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("staffs.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff deleted",
      await this.staffsService.delete(id, user, getRequestMeta(request))
    );
  }
}
