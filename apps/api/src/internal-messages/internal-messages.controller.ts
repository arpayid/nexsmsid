import { Body, Controller, Delete, Get, Inject, Param, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { InternalMessagesService } from "./internal-messages.service";

@Controller("internal-messages")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InternalMessagesController {
  constructor(@Inject(InternalMessagesService) private readonly service: InternalMessagesService) {}

  @Get("inbox")
  @RequirePermissions("messages.view")
  async inbox(@Query() query: unknown, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.service.inbox(query, user);
    return apiSuccess("Inbox messages retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get("sent")
  @RequirePermissions("messages.view")
  async sent(@Query() query: unknown, @CurrentUser() user: AuthenticatedUser) {
    const result = await this.service.sent(query, user);
    return apiSuccess("Sent messages retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("messages.send")
  async send(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Message sent", await this.service.send(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("messages.view")
  async findById(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return apiSuccess("Message retrieved", await this.service.findById(id, user));
  }

  @Post(":id/read")
  @RequirePermissions("messages.read")
  async markRead(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Message marked as read", await this.service.markRead(id, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("messages.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Message deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }
}
