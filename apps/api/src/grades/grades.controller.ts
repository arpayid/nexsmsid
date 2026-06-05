import { Body, Controller, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PrintDocumentService } from "../pdf/print-document.service";
import { GradesService } from "./grades.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class GradesController {
  constructor(
    @Inject(GradesService) private readonly service: GradesService,
    @Inject(PrintDocumentService) private readonly printService: PrintDocumentService
  ) {}

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

  @Get("grades/classrooms/:classroomId/recap.pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("grades.print")
  async downloadClassroomRecap(
    @Param("classroomId") classroomId: string,
    @Query("semesterId") semesterId: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Res() res: Response
  ) {
    const buffer = await this.printService.renderGradeRecap(classroomId, semesterId);
    await this.printService.logPrint(
      "grades.recap.print",
      "classroom",
      classroomId,
      user,
      getRequestMeta(request),
      { semesterId: semesterId ?? null }
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="grade-recap-${classroomId}.pdf"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
