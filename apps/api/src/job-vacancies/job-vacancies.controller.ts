import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { JobVacanciesService } from "./job-vacancies.service";

@Controller("job-vacancies")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class JobVacanciesController {
  constructor(@Inject(JobVacanciesService) private readonly service: JobVacanciesService) {}

  @Get()
  @RequirePermissions("job-vacancies.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Job vacancies retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("job-vacancies.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job vacancy created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("job-vacancies.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Job vacancy retrieved", await this.service.findById(id));
  }

  @Patch(":id")
  @RequirePermissions("job-vacancies.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job vacancy updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("job-vacancies.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job vacancy deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/publish")
  @RequirePermissions("job-vacancies.publish")
  async publish(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job vacancy published", await this.service.publish(id, user, getRequestMeta(request)));
  }

  @Post(":id/close")
  @RequirePermissions("job-vacancies.close")
  async close(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Job vacancy closed", await this.service.close(id, user, getRequestMeta(request)));
  }
}

@Controller("public/jobs")
@UseGuards(JwtAuthGuard, PermissionGuard)
@Public()
export class PublicJobsController {
  constructor(@Inject(JobVacanciesService) private readonly service: JobVacanciesService) {}

  @Get()
  async list(@Query() query: unknown) {
    const result = await this.service.publicList(query);
    return apiSuccess("Public jobs retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  async findById(@Param("id") id: string) {
    return apiSuccess("Public job retrieved", await this.service.publicFindById(id));
  }

  @Post(":id/apply")
  async apply(@Param("id") id: string, @Body() body: unknown) {
    return apiSuccess("Job application submitted", await this.service.publicApply(id, body));
  }
}
