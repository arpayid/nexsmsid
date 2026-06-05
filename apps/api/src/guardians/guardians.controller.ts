import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";

import { AuthenticatedUser, getRequestMeta, RequestWithUser } from "../auth/auth.types";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { RequirePermissions } from "../auth/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { apiSuccess } from "../common/api-response";
import { ExcelImportService } from "../excel/excel-import.service";
import { getGuardiansImportConfig } from "./guardians.excel";
import { GuardiansService } from "./guardians.service";

@Controller("guardians")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class GuardiansController {
  constructor(
    @Inject(GuardiansService) private readonly guardiansService: GuardiansService,
    @Inject(ExcelImportService) private readonly excelImportService: ExcelImportService
  ) {}

  @Get()
  @RequirePermissions("guardians.view")
  async list(@Query() query: unknown) {
    const result = await this.guardiansService.list(query);
    return apiSuccess("Guardians retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get("template")
  @RequirePermissions("guardians.import")
  async template(@Res() response: Response) {
    const buffer = await this.excelImportService.buildTemplate(getGuardiansImportConfig(this.guardiansService));
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="guardians-template.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Get("export")
  @RequirePermissions("guardians.export")
  async export(@Res() response: Response) {
    const records = await this.guardiansService.exportAll();
    const buffer = await this.excelImportService.exportRows(getGuardiansImportConfig(this.guardiansService), records);
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="guardians-export.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Post("import")
  @RequirePermissions("guardians.import")
  @UseInterceptors(FileInterceptor("file"))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Body() _body: unknown
  ) {
    if (!file) {
      return apiSuccess("Guardian import failed", {
        totalRows: 0,
        successRows: 0,
        failedRows: 0,
        errors: [{ row: 0, message: "No file uploaded" }]
      });
    }
    const result = await this.excelImportService.importFromBuffer(
      getGuardiansImportConfig(this.guardiansService),
      file.buffer,
      user,
      getRequestMeta(request)
    );
    return apiSuccess("Guardian import completed", result);
  }

  @Get(":id")
  @RequirePermissions("guardians.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Guardian retrieved", await this.guardiansService.findById(id));
  }

  @Post()
  @RequirePermissions("guardians.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian created",
      await this.guardiansService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("guardians.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian updated",
      await this.guardiansService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("guardians.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Guardian deleted",
      await this.guardiansService.delete(id, user, getRequestMeta(request))
    );
  }
}
