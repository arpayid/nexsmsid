import { Body, Controller, Delete, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { DisciplineService } from "./discipline.service";

@Controller("discipline")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class DisciplineController {
  constructor(@Inject(DisciplineService) private readonly service: DisciplineService) {}

  @Get("rules")
  @RequirePermissions("discipline.view")
  async listRules(@Query() query: unknown) {
    const result = await this.service.listRules(query);
    return apiSuccess("Discipline rules retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("rules")
  @RequirePermissions("discipline.create")
  async createRule(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline rule created", await this.service.createRule(body, user, getRequestMeta(request)));
  }

  @Get("rules/:id")
  @RequirePermissions("discipline.view")
  async getRule(@Param("id") id: string) {
    return apiSuccess("Discipline rule retrieved", await this.service.getRule(id));
  }

  @Patch("rules/:id")
  @RequirePermissions("discipline.update")
  async updateRule(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline rule updated", await this.service.updateRule(id, body, user, getRequestMeta(request)));
  }

  @Delete("rules/:id")
  @RequirePermissions("discipline.delete")
  async deleteRule(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline rule deleted", await this.service.deleteRule(id, user, getRequestMeta(request)));
  }

  @Get("violations")
  @RequirePermissions("discipline.view")
  async listViolations(@Query() query: unknown) {
    const result = await this.service.listViolations(query);
    return apiSuccess("Discipline violations retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("violations")
  @RequirePermissions("discipline.create")
  async createViolation(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline violation created", await this.service.createViolation(body, user, getRequestMeta(request)));
  }

  @Get("violations/:id")
  @RequirePermissions("discipline.view")
  async getViolation(@Param("id") id: string) {
    return apiSuccess("Discipline violation retrieved", await this.service.getViolation(id));
  }

  @Patch("violations/:id")
  @RequirePermissions("discipline.update")
  async updateViolation(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline violation updated", await this.service.updateViolation(id, body, user, getRequestMeta(request)));
  }

  @Delete("violations/:id")
  @RequirePermissions("discipline.delete")
  async deleteViolation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline violation deleted", await this.service.deleteViolation(id, user, getRequestMeta(request)));
  }

  @Post("violations/:id/confirm")
  @RequirePermissions("discipline.update")
  async confirmViolation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline violation confirmed", await this.service.confirmViolation(id, user, getRequestMeta(request)));
  }

  @Post("violations/:id/cancel")
  @RequirePermissions("discipline.update")
  async cancelViolation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Discipline violation cancelled", await this.service.cancelViolation(id, user, getRequestMeta(request)));
  }

  @Get("achievements")
  @RequirePermissions("discipline.view")
  async listAchievements(@Query() query: unknown) {
    const result = await this.service.listAchievements(query);
    return apiSuccess("Student achievements retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("achievements")
  @RequirePermissions("discipline.create")
  async createAchievement(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Student achievement created", await this.service.createAchievement(body, user, getRequestMeta(request)));
  }

  @Get("achievements/:id")
  @RequirePermissions("discipline.view")
  async getAchievement(@Param("id") id: string) {
    return apiSuccess("Student achievement retrieved", await this.service.getAchievement(id));
  }

  @Patch("achievements/:id")
  @RequirePermissions("discipline.update")
  async updateAchievement(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Student achievement updated", await this.service.updateAchievement(id, body, user, getRequestMeta(request)));
  }

  @Delete("achievements/:id")
  @RequirePermissions("discipline.delete")
  async deleteAchievement(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Student achievement deleted", await this.service.deleteAchievement(id, user, getRequestMeta(request)));
  }

  @Get("students/:studentId/summary")
  @RequirePermissions("discipline.report")
  async studentSummary(@Param("studentId") studentId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Student discipline summary retrieved", await this.service.getStudentSummary(studentId, user, getRequestMeta(request)));
  }

  @Get("classrooms/:classroomId/summary")
  @RequirePermissions("discipline.report")
  async classroomSummary(@Param("classroomId") classroomId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Classroom discipline summary retrieved", await this.service.getClassroomSummary(classroomId, user, getRequestMeta(request)));
  }

  @Get("violations/:id/print")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("discipline.print")
  async printViolation(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const result = await this.service.printViolation(id, user, getRequestMeta(request));
    this.sendPdf(res, result.buffer, result.filename);
  }

  @Get("students/:studentId/summary.pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("discipline.print")
  async printStudentSummary(@Param("studentId") studentId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const result = await this.service.printStudentSummary(studentId, user, getRequestMeta(request));
    this.sendPdf(res, result.buffer, result.filename);
  }

  private sendPdf(res: Response, buffer: Buffer, filename: string) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
