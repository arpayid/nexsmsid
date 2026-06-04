import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { NotificationTemplatesService } from "./notification-templates.service";

@Controller("notification-templates")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NotificationTemplatesController {
  constructor(@Inject(NotificationTemplatesService) private readonly service: NotificationTemplatesService) {}

  @Get()
  @RequirePermissions("notification-templates.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Notification templates retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("notification-templates.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification template created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("notification-templates.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Notification template retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("notification-templates.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification template updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("notification-templates.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification template deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
