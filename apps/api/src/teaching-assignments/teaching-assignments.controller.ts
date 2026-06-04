import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { TeachingAssignmentsService } from "./teaching-assignments.service";

@Controller("teaching-assignments")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TeachingAssignmentsController {
  constructor(@Inject(TeachingAssignmentsService) private readonly service: TeachingAssignmentsService) {}

  @Get()
  @RequirePermissions("teaching-assignments.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Teaching assignments retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("teaching-assignments.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Teaching assignment retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("teaching-assignments.manage")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Teaching assignment created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("teaching-assignments.manage")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Teaching assignment updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("teaching-assignments.manage")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Teaching assignment deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
