import { Body, Controller, Get, Inject, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { PpdbRegistrationsService } from "./ppdb-registrations.service";

@Controller("ppdb/documents")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PpdbDocumentsController {
  constructor(@Inject(PpdbRegistrationsService) private readonly service: PpdbRegistrationsService) {}

  @Get(":id")
  @RequirePermissions("ppdb.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Document retrieved", await this.service.listDocuments(id));
  }

  @Patch(":documentId")
  @RequirePermissions("ppdb.update")
  async update(@Param("documentId") documentId: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Document updated", await this.service.updateDocument(documentId, body));
  }

  @Post(":documentId/verify")
  @RequirePermissions("ppdb.verify")
  async verify(@Param("documentId") documentId: string, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Document verified", await this.service.verifyDocument(documentId, user, getRequestMeta(request)));
  }

  @Post(":documentId/reject")
  @RequirePermissions("ppdb.reject")
  async reject(@Param("documentId") documentId: string, @Body() body: unknown, @CurrentUser() user: AuthenticatedUser, @Req() request: RequestWithUser) {
    return apiSuccess("Document rejected", await this.service.rejectDocument(documentId, body, user, getRequestMeta(request)));
  }
}
