import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class NotificationsController {
  constructor(@Inject(NotificationsService) private readonly service: NotificationsService) {}

  @Get()
  @RequirePermissions("notifications.view")
  async list(@Query() query: unknown, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.service.list(query, user);
    return apiSuccess("Notifications retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get("unread-count")
  @RequirePermissions("notifications.view")
  async unreadCount(@CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Unread notification count retrieved", await this.service.unreadCount(user));
  }

  @Post()
  @RequirePermissions("notifications.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Post("read-all")
  @RequirePermissions("notifications.read")
  async markAllRead(@CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notifications marked as read", await this.service.markAllRead(user, getRequestMeta(request)));
  }

  @Post(":id/read")
  @RequirePermissions("notifications.read")
  async markRead(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification marked as read", await this.service.markRead(id, user, getRequestMeta(request)));
  }

  @Post(":id/archive")
  @RequirePermissions("notifications.archive")
  async archive(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Notification archived", await this.service.archive(id, user, getRequestMeta(request)));
  }
}
