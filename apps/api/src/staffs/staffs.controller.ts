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
import { getStaffsImportConfig } from "./staffs.excel";
import { StaffsService } from "./staffs.service";

@Controller("staffs")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StaffsController {
  constructor(
    @Inject(StaffsService) private readonly staffsService: StaffsService,
    @Inject(ExcelImportService) private readonly excelImportService: ExcelImportService
  ) {}

  @Get()
  @RequirePermissions("staffs.view")
  async list(@Query() query: unknown) {
    const result = await this.staffsService.list(query);
    return apiSuccess("Staffs retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get("template")
  @RequirePermissions("staffs.import")
  async template(@Res() response: Response) {
    const buffer = await this.excelImportService.buildTemplate(getStaffsImportConfig(this.staffsService));
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="staffs-template.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Get("export")
  @RequirePermissions("staffs.export")
  async export(@Res() response: Response) {
    const records = await this.staffsService.exportAll();
    const buffer = await this.excelImportService.exportRows(getStaffsImportConfig(this.staffsService), records);
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="staffs-export.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Post("import")
  @RequirePermissions("staffs.import")
  @UseInterceptors(FileInterceptor("file"))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Body() _body: unknown
  ) {
    if (!file) {
      return apiSuccess("Staff import failed", {
        totalRows: 0,
        successRows: 0,
        failedRows: 0,
        errors: [{ row: 0, message: "No file uploaded" }]
      });
    }
    const result = await this.excelImportService.importFromBuffer(
      getStaffsImportConfig(this.staffsService),
      file.buffer,
      user,
      getRequestMeta(request)
    );
    return apiSuccess("Staff import completed", result);
  }

  @Get(":id")
  @RequirePermissions("staffs.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Staff retrieved", await this.staffsService.findById(id));
  }

  @Post()
  @RequirePermissions("staffs.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff created",
      await this.staffsService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("staffs.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff updated",
      await this.staffsService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("staffs.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Staff deleted",
      await this.staffsService.delete(id, user, getRequestMeta(request))
    );
  }
}
