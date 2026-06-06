import { Body, Controller, Delete, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { LettersService } from "./letters.service";

@Controller("letters")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class LettersController {
  constructor(@Inject(LettersService) private readonly service: LettersService) {}

  @Get("templates")
  @RequirePermissions("letters.view")
  async listTemplates(@Query() query: unknown) {
    const result = await this.service.listTemplates(query);
    return apiSuccess("Letter templates retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post("templates")
  @RequirePermissions("letters.manage-templates")
  async createTemplate(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter template created", await this.service.createTemplate(body, user, getRequestMeta(request)));
  }

  @Get("templates/:id")
  @RequirePermissions("letters.view")
  async getTemplate(@Param("id") id: string) {
    return apiSuccess("Letter template retrieved", await this.service.getTemplate(id));
  }

  @Patch("templates/:id")
  @RequirePermissions("letters.manage-templates")
  async updateTemplate(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter template updated", await this.service.updateTemplate(id, body, user, getRequestMeta(request)));
  }

  @Delete("templates/:id")
  @RequirePermissions("letters.manage-templates")
  async deleteTemplate(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter template deleted", await this.service.deleteTemplate(id, user, getRequestMeta(request)));
  }

  @Get("summary")
  @RequirePermissions("letters.report")
  async summary() {
    return apiSuccess("Letter summary retrieved", await this.service.summary());
  }

  @Get("number-preview")
  @RequirePermissions("letters.view")
  async numberPreview(@Query() query: unknown) {
    return apiSuccess("Letter number preview retrieved", await this.service.numberPreview(query));
  }

  @Get()
  @RequirePermissions("letters.view")
  async listLetters(@Query() query: unknown) {
    const result = await this.service.listLetters(query);
    return apiSuccess("Letters retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Post()
  @RequirePermissions("letters.create")
  async createLetter(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter created", await this.service.createLetter(body, user, getRequestMeta(request)));
  }

  @Get(":id")
  @RequirePermissions("letters.view")
  async getLetter(@Param("id") id: string) {
    return apiSuccess("Letter retrieved", await this.service.getLetter(id));
  }

  @Patch(":id")
  @RequirePermissions("letters.update")
  async updateLetter(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter updated", await this.service.updateLetter(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("letters.delete")
  async deleteLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter deleted", await this.service.deleteLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/submit")
  @RequirePermissions("letters.update")
  async submitLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter submitted", await this.service.submitLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/approve")
  @RequirePermissions("letters.approve")
  async approveLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter approved", await this.service.approveLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/reject")
  @RequirePermissions("letters.reject")
  async rejectLetter(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter rejected", await this.service.rejectLetter(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/issue")
  @RequirePermissions("letters.issue")
  async issueLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter issued", await this.service.issueLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/archive")
  @RequirePermissions("letters.archive")
  async archiveLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter archived", await this.service.archiveLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/cancel")
  @RequirePermissions("letters.update")
  async cancelLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter cancelled", await this.service.cancelLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/reopen")
  @RequirePermissions("letters.update")
  async reopenLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter reopened", await this.service.reopenLetter(id, user, getRequestMeta(request)));
  }

  @Post(":id/generate-number")
  @RequirePermissions("letters.issue")
  async generateNumber(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Letter number generated", await this.service.generateNumber(id, user, getRequestMeta(request)));
  }

  @Get(":id/print")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("letters.print")
  async printLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const result = await this.service.printLetter(id, user, getRequestMeta(request));
    this.sendPdf(res, result.buffer, result.filename);
  }

  @Get(":id/pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("letters.print")
  async pdfLetter(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser, @Res() res: Response) {
    const result = await this.service.printLetter(id, user, getRequestMeta(request));
    this.sendPdf(res, result.buffer, result.filename);
  }

  private sendPdf(res: Response, buffer: Buffer, filename: string) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
