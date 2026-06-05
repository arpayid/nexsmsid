import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { Public } from "../auth/decorators/public.decorator";
import { apiSuccess } from "../common/api-response";
import { AnnouncementsService } from "./announcements.service";

@Controller("announcements")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AnnouncementsController {
  constructor(@Inject(AnnouncementsService) private readonly service: AnnouncementsService) {}

  @Get()
  @RequirePermissions("announcements.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Announcements retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("announcements.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Announcement created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("announcements.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Announcement retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("announcements.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Announcement updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("announcements.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Announcement deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/publish")
  @RequirePermissions("announcements.publish")
  async publish(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Announcement published", await this.service.publish(id, user, getRequestMeta(request)));
  }

  @Post(":id/archive")
  @RequirePermissions("announcements.archive")
  async archive(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Announcement archived", await this.service.archive(id, user, getRequestMeta(request)));
  }
}

@Controller("public/announcements")
@UseGuards(JwtAuthGuard, PermissionGuard)
@Public()
export class PublicAnnouncementsController {
  constructor(@Inject(AnnouncementsService) private readonly service: AnnouncementsService) {}

  @Get()
  async list(@Query() query: unknown) {
    const result = await this.service.publicList(query);
    return apiSuccess("Public announcements retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return apiSuccess("Public announcement retrieved", await this.service.publicFindById(id));
  }
}
