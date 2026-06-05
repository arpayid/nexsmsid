import { Body, Controller, Delete, Get, Header, Inject, Param, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PrintDocumentService } from "../pdf/print-document.service";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InvoicesController {
  constructor(
    @Inject(InvoicesService) private readonly service: InvoicesService,
    @Inject(PrintDocumentService) private readonly printService: PrintDocumentService
  ) {}

  @Get()
  @RequirePermissions("invoices.view")
  async list(@Query() query: unknown) {
    const result = await this.service.list(query);
    return apiSuccess("Invoices retrieved", result.items, { page: result.page, limit: result.limit, total: result.total });
  }

  @Get(":id")
  @RequirePermissions("invoices.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Invoice retrieved", await this.service.findById(id));
  }

  @Post()
  @RequirePermissions("invoices.create")
  async create(@Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Invoice created", await this.service.create(body, user, getRequestMeta(request)));
  }

  @Patch(":id")
  @RequirePermissions("invoices.update")
  async update(@Param("id") id: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Invoice updated", await this.service.update(id, body, user, getRequestMeta(request)));
  }

  @Delete(":id")
  @RequirePermissions("invoices.delete")
  async delete(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Invoice deleted", await this.service.delete(id, user, getRequestMeta(request)));
  }

  @Post(":id/issue")
  @RequirePermissions("invoices.issue")
  async issue(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Invoice issued", await this.service.issue(id, user, getRequestMeta(request)));
  }

  @Post(":id/cancel")
  @RequirePermissions("invoices.cancel")
  async cancel(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Invoice cancelled", await this.service.cancel(id, user, getRequestMeta(request)));
  }

  @Get(":id/pdf")
  @Header("Content-Type", "application/pdf")
  @RequirePermissions("invoices.print")
  async downloadPdf(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Res() res: Response
  ) {
    const invoice = await this.service.findById(id);
    const buffer = await this.printService.renderInvoice(id);
    await this.printService.logPrint("invoice.print", "invoice", id, user, getRequestMeta(request), {
      invoiceNumber: invoice.invoiceNumber
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.end(buffer);
  }
}
