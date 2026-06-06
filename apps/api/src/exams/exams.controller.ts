import { Body, Controller, Delete, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ExamsService } from "./exams.service";
import { ExamPdfService } from "./exam-pdf.service";
import { ExamReportService } from "./exam-report.service";

@Controller("exams")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ExamsController {
  constructor(
    @Inject(ExamsService) private readonly service: ExamsService,
    @Inject(ExamPdfService) private readonly pdfService: ExamPdfService,
    @Inject(ExamReportService) private readonly reportService: ExamReportService
  ) {}

  // ── Exam Types ──────────────────────────────────────────────
  @Get("types")
  @RequirePermissions("exams.view")
  async listTypes(@Query() query: unknown) {
    const data = await this.service.listExamTypes(query as any);
    return apiSuccess("Exam types retrieved", data.data, data.meta);
  }

  @Post("types")
  @RequirePermissions("exams.create")
  async createType(@Body() body: unknown) {
    const data = await this.service.createExamType(body as any);
    return apiSuccess("Exam type created", data);
  }

  @Get("types/:id")
  @RequirePermissions("exams.view")
  async getType(@Param("id") id: string) {
    const data = await this.service.getExamType(id);
    return apiSuccess("Exam type retrieved", data);
  }

  @Patch("types/:id")
  @RequirePermissions("exams.update")
  async updateType(@Param("id") id: string, @Body() body: unknown) {
    const data = await this.service.updateExamType(id, body as any);
    return apiSuccess("Exam type updated", data);
  }

  @Delete("types/:id")
  @RequirePermissions("exams.delete")
  async deleteType(@Param("id") id: string) {
    const data = await this.service.deleteExamType(id);
    return apiSuccess("Exam type deleted", data);
  }

  // ── Exam Rooms ──────────────────────────────────────────────
  @Get("rooms")
  @RequirePermissions("exams.view")
  async listRooms(@Query() query: unknown) {
    const data = await this.service.listRooms(query as any);
    return apiSuccess("Exam rooms retrieved", data.data, data.meta);
  }

  @Post("rooms")
  @RequirePermissions("exams.create")
  async createRoom(@Body() body: unknown) {
    const data = await this.service.createRoom(body as any);
    return apiSuccess("Exam room created", data);
  }

  @Get("rooms/:id")
  @RequirePermissions("exams.view")
  async getRoom(@Param("id") id: string) {
    const data = await this.service.getRoom(id);
    return apiSuccess("Exam room retrieved", data);
  }

  @Patch("rooms/:id")
  @RequirePermissions("exams.update")
  async updateRoom(@Param("id") id: string, @Body() body: unknown) {
    const data = await this.service.updateRoom(id, body as any);
    return apiSuccess("Exam room updated", data);
  }

  @Delete("rooms/:id")
  @RequirePermissions("exams.delete")
  async deleteRoom(@Param("id") id: string) {
    const data = await this.service.deleteRoom(id);
    return apiSuccess("Exam room deleted", data);
  }

  // ── Exams ───────────────────────────────────────────────────
  @Get()
  @RequirePermissions("exams.view")
  async listExams(@Query() query: unknown) {
    const data = await this.service.listExams(query as any);
    return apiSuccess("Exams retrieved", data.data, data.meta);
  }

  @Post()
  @RequirePermissions("exams.create")
  async createExam(@Body() body: unknown) {
    const data = await this.service.createExam(body as any);
    return apiSuccess("Exam created", data);
  }

  @Get("summary")
  @RequirePermissions("exams.view")
  async summary() {
    const data = await this.reportService.getSummary();
    return apiSuccess("Exam summary retrieved", data);
  }

  @Get("banks")
  @RequirePermissions("exams.view")
  async listBanks(@Query() query: unknown) {
    const data = await this.service.listBanks(query as any);
    return apiSuccess("Question banks retrieved", data.data, data.meta);
  }

  @Post("banks")
  @RequirePermissions("exams.create")
  async createBank(@Body() body: unknown) {
    const data = await this.service.createBank(body as any);
    return apiSuccess("Question bank created", data);
  }

  @Get(":id")
  @RequirePermissions("exams.view")
  async getExam(@Param("id") id: string) {
    const data = await this.service.getExam(id);
    return apiSuccess("Exam retrieved", data);
  }

  @Patch(":id")
  @RequirePermissions("exams.update")
  async updateExam(@Param("id") id: string, @Body() body: unknown) {
    const data = await this.service.updateExam(id, body as any);
    return apiSuccess("Exam updated", data);
  }

  @Delete(":id")
  @RequirePermissions("exams.delete")
  async deleteExam(@Param("id") id: string) {
    const data = await this.service.deleteExam(id);
    return apiSuccess("Exam deleted", data);
  }

  @Post(":id/status")
  @RequirePermissions("exams.update")
  async updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    const data = await this.service.updateExamStatus(id, body.status);
    return apiSuccess("Exam status updated", data);
  }

  // ── Participants ────────────────────────────────────────────
  @Get(":id/participants")
  @RequirePermissions("exams.participants")
  async listParticipants(@Param("id") id: string, @Query() query: unknown) {
    const data = await this.service.listParticipants(id, query as any);
    return apiSuccess("Participants retrieved", data.data, data.meta);
  }

  @Post(":id/participants")
  @RequirePermissions("exams.participants")
  async addParticipant(@Param("id") id: string, @Body() body: { studentId: string }) {
    const data = await this.service.addParticipant(id, body.studentId);
    return apiSuccess("Participant added", data);
  }

  @Post(":id/participants/bulk")
  @RequirePermissions("exams.participants")
  async addParticipantsBulk(@Param("id") id: string, @Body() body: { studentIds: string[] }) {
    const data = await this.service.addParticipantsBulk(id, body.studentIds);
    return apiSuccess("Participants added", data);
  }

  @Delete(":id/participants/:participantId")
  @RequirePermissions("exams.participants")
  async removeParticipant(@Param("id") id: string, @Param("participantId") participantId: string) {
    const data = await this.service.removeParticipant(id, participantId);
    return apiSuccess("Participant removed", data);
  }

  @Patch(":id/participants/:participantId/status")
  @RequirePermissions("exams.participants")
  async updateParticipantStatus(@Param("id") id: string, @Param("participantId") participantId: string, @Body() body: { status: string }) {
    const data = await this.service.updateParticipantStatus(id, participantId, body.status);
    return apiSuccess("Participant status updated", data);
  }

  // ── Schedules ───────────────────────────────────────────────
  @Get(":id/schedules")
  @RequirePermissions("exams.schedule")
  async listSchedules(@Param("id") id: string) {
    const data = await this.service.listSchedules(id);
    return apiSuccess("Schedules retrieved", data);
  }

  @Post(":id/schedules")
  @RequirePermissions("exams.schedule")
  async createSchedule(@Param("id") id: string, @Body() body: unknown) {
    const data = await this.service.createSchedule(id, body as any);
    return apiSuccess("Schedule created", data);
  }

  @Patch("schedules/:scheduleId")
  @RequirePermissions("exams.schedule")
  async updateSchedule(@Param("scheduleId") scheduleId: string, @Body() body: unknown) {
    const data = await this.service.updateSchedule(scheduleId, body as any);
    return apiSuccess("Schedule updated", data);
  }

  @Delete("schedules/:scheduleId")
  @RequirePermissions("exams.schedule")
  async deleteSchedule(@Param("scheduleId") scheduleId: string) {
    const data = await this.service.deleteSchedule(scheduleId);
    return apiSuccess("Schedule deleted", data);
  }

  // ── Sessions ────────────────────────────────────────────────
  @Get("schedules/:scheduleId/sessions")
  @RequirePermissions("exams.schedule")
  async listSessions(@Param("scheduleId") scheduleId: string) {
    const data = await this.service.listSessions(scheduleId);
    return apiSuccess("Sessions retrieved", data);
  }

  @Post("schedules/:scheduleId/sessions")
  @RequirePermissions("exams.schedule")
  async createSession(@Param("scheduleId") scheduleId: string, @Body() body: unknown) {
    const data = await this.service.createSession(scheduleId, body as any);
    return apiSuccess("Session created", data);
  }

  @Patch("sessions/:sessionId/status")
  @RequirePermissions("exams.schedule")
  async updateSessionStatus(@Param("sessionId") sessionId: string, @Body() body: { status: string }) {
    const data = await this.service.updateSessionStatus(sessionId, body.status);
    return apiSuccess("Session status updated", data);
  }

  // ── Questions ───────────────────────────────────────────────
  @Get(":id/questions")
  @RequirePermissions("exams.view")
  async listQuestions(@Param("id") id: string) {
    const data = await this.service.listQuestions(id);
    return apiSuccess("Questions retrieved", data);
  }

  @Post(":id/questions")
  @RequirePermissions("exams.create")
  async addQuestion(@Param("id") id: string, @Body() body: unknown) {
    const data = await this.service.addQuestion(id, body as any);
    return apiSuccess("Question added", data);
  }

  @Patch("questions/:questionId")
  @RequirePermissions("exams.update")
  async updateQuestion(@Param("questionId") questionId: string, @Body() body: unknown) {
    const data = await this.service.updateQuestion(questionId, body as any);
    return apiSuccess("Question updated", data);
  }

  @Delete("questions/:questionId")
  @RequirePermissions("exams.delete")
  async deleteQuestion(@Param("questionId") questionId: string) {
    const data = await this.service.deleteQuestion(questionId);
    return apiSuccess("Question deleted", data);
  }

  // ── Results ─────────────────────────────────────────────────
  @Get(":id/results")
  @RequirePermissions("exams.view")
  async listResults(@Param("id") id: string, @Query() query: unknown) {
    const data = await this.service.listResults(id, query as any);
    return apiSuccess("Results retrieved", data.data, data.meta);
  }

  // ── PDF (Exam Card) ─────────────────────────────────────────
  @Get(":id/print-card")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("exams.print-card")
  async printExamCard(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateExamCard(id, user, request);
    this.sendPdf(res, pdfBuffer, `exam-card-${id}.pdf`);
  }

  @Get(":id/print-card-participant/:participantId")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("exams.print-card")
  async printParticipantCard(@Param("id") id: string, @Param("participantId") participantId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const pdfBuffer = await this.pdfService.generateParticipantCard(id, participantId, user, request);
    this.sendPdf(res, pdfBuffer, `exam-participant-card-${participantId}.pdf`);
  }

  // ── Reports ─────────────────────────────────────────────────
  @Get(":id/report")
  @RequirePermissions("exams.export")
  async generateReport(@Param("id") id: string, @Query("format") format: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const { buffer, contentType, filename } = await this.reportService.generateExamReport(id, format || "xlsx", user, request);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  }

  private sendPdf(res: Response, buffer: Buffer, filename: string) {
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(buffer);
  }
}
