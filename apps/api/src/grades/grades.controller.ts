import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { GradesService } from "./grades.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class GradesController {
  constructor(@Inject(GradesService) private readonly service: GradesService) {}

  @Get("grades/assessments")
  @RequirePermissions("grades.view")
  async listAssessments(@Query() query: unknown) {
    const result = await this.service.listAssessments(query);
    return apiSuccess("Assessments retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get("grades/assessments/:id")
  @RequirePermissions("grades.view")
  async findAssessmentById(@Param("id") id: string) {
    return apiSuccess("Assessment retrieved", await this.service.findAssessmentById(id));
  }

  @Post("grades/assessments")
  @RequirePermissions("grades.input")
  async createAssessment(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Assessment created", await this.service.createAssessment(body, user, getRequestMeta(request)));
  }

  @Patch("grades/assessments/:id")
  @RequirePermissions("grades.update")
  async updateAssessment(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Assessment updated", await this.service.updateAssessment(id, body, user, getRequestMeta(request)));
  }

  @Post("grades/assessments/:id/scores")
  @RequirePermissions("grades.input")
  async inputScores(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Scores inputted", await this.service.inputScores(id, body, user, getRequestMeta(request)));
  }

  @Post("grades/assessments/:id/approve")
  @RequirePermissions("grades.approve")
  async approveScores(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Scores approved", await this.service.approveScores(id, body, user, getRequestMeta(request)));
  }

  @Get("grades/students/:studentId/summary")
  @RequirePermissions("grades.view")
  async getStudentSummary(@Param("studentId") studentId: string) {
    return apiSuccess("Grade summary retrieved", await this.service.getStudentSummary(studentId));
  }

  @Get("grades/classrooms/:classroomId/summary")
  @RequirePermissions("grades.view")
  async getClassroomSummary(@Param("classroomId") classroomId: string) {
    return apiSuccess("Grade summary retrieved", await this.service.getClassroomSummary(classroomId));
  }
}
