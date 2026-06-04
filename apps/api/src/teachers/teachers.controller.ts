import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { TeachersService } from "./teachers.service";

@Controller("teachers")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TeachersController {
  constructor(@Inject(TeachersService) private readonly teachersService: TeachersService) {}

  @Get()
  @RequirePermissions("teachers.view")
  async list(@Query() query: unknown) {
    const result = await this.teachersService.list(query);
    return apiSuccess("Teachers retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get(":id")
  @RequirePermissions("teachers.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Teacher retrieved", await this.teachersService.findById(id));
  }

  @Post()
  @RequirePermissions("teachers.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher created",
      await this.teachersService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("teachers.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher updated",
      await this.teachersService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("teachers.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher deleted",
      await this.teachersService.delete(id, user, getRequestMeta(request))
    );
  }
}
