import { Body, Controller, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PrintDocumentService } from "../pdf/print-document.service";
import { PpdbRegistrationsService } from "./ppdb-registrations.service";

@Controller("ppdb/registrations")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PpdbRegistrationsController {
  constructor(
    @Inject(PpdbRegistrationsService) private readonly service: PpdbRegistrationsService,
    @Inject(PrintDocumentService) private readonly printService: PrintDocumentService
  ) {}

  @Get()
  @RequirePermissions("ppdb.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("PPDB registrations retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("ppdb.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("PPDB registration retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("ppdb.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("ppdb.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/submit")
  @RequirePermissions("ppdb.create")
  async submit(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration submitted", await this.service.submit(id, user, getRequestMeta(request)));
  }

  @Post(":id/verify")
  @RequirePermissions("ppdb.verify")
  async verify(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration verified", await this.service.verify(id, user, getRequestMeta(request)));
  }

  @Post(":id/request-revision")
  @RequirePermissions("ppdb.update")
  async requestRevision(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB revision requested", await this.service.requestRevision(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/accept")
  @RequirePermissions("ppdb.approve")
  async accept(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration accepted", await this.service.accept(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/reject")
  @RequirePermissions("ppdb.reject")
  async reject(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration rejected", await this.service.reject(id, body, user, getRequestMeta(request)));
  }

  @Post(":id/convert-to-student")
  @RequirePermissions("ppdb.convert")
  async convertToStudent(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("PPDB registration converted to student", await this.service.convertToStudent(id, user, getRequestMeta(request)));
  }

  @Get(":id/documents")
  @RequirePermissions("ppdb.view")
  async listDocuments(@Param("id") id: string) {
    return apiSuccess("Documents retrieved", await this.service.listDocuments(id));
  }

  @Post(":id/documents")
  @RequirePermissions("ppdb.create")
  async createDocument(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Document added", await this.service.createDocument(id, body, user, getRequestMeta(request)));
  }

  @Get(":id/proof.pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("ppdb.print")
  async downloadProof(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Res() res: Response
  ) {
    const reg = await this.service.findById(id);
    const buffer = await this.printService.renderPpdbProof(id);
    await this.printService.logPrint("ppdb.proof.print", "ppdb_registration", id, user, getRequestMeta(request), {
      registrationNumber: reg.registrationNumber
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="ppdb-${reg.registrationNumber}.pdf"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
