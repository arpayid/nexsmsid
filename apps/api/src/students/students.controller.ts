import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { StudentsService } from "./students.service";

@Controller("students")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StudentsController {
  constructor(@Inject(StudentsService) private readonly studentsService: StudentsService) {}

  @Get()
  @RequirePermissions("students.view")
  async list(@Query() query: unknown) {
    const result = await this.studentsService.list(query);
    return apiSuccess("Students retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get(":id")
  @RequirePermissions("students.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Student retrieved", await this.studentsService.findById(id));
  }

  @Post()
  @RequirePermissions("students.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student created",
      await this.studentsService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("students.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student updated",
      await this.studentsService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("students.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student deleted",
      await this.studentsService.delete(id, user, getRequestMeta(request))
    );
  }
}
