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
import { getTeachersImportConfig } from "./teachers.excel";
import { TeachersService } from "./teachers.service";

@Controller("teachers")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TeachersController {
  constructor(
    @Inject(TeachersService) private readonly teachersService: TeachersService,
    @Inject(ExcelImportService) private readonly excelImportService: ExcelImportService
  ) {}

  @Get()
  @RequirePermissions("teachers.view")
  async list(@Query() query: unknown) {
    const result = await this.teachersService.list(query);
    return apiSuccess("Teachers retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get("template")
  @RequirePermissions("teachers.import")
  async template(@Res() response: Response) {
    const buffer = await this.excelImportService.buildTemplate(getTeachersImportConfig(this.teachersService));
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="teachers-template.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Get("export")
  @RequirePermissions("teachers.export")
  async export(@Res() response: Response) {
    const records = await this.teachersService.exportAll();
    const buffer = await this.excelImportService.exportRows(getTeachersImportConfig(this.teachersService), records);
    response
      .status(200)
      .setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .setHeader("Content-Disposition", `attachment; filename="teachers-export.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Post("import")
  @RequirePermissions("teachers.import")
  @UseInterceptors(FileInterceptor("file"))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Body() _body: unknown
  ) {
    if (!file) {
      return apiSuccess("Teacher import failed", {
        totalRows: 0,
        successRows: 0,
        failedRows: 0,
        errors: [{ row: 0, message: "No file uploaded" }]
      });
    }
    const result = await this.excelImportService.importFromBuffer(
      getTeachersImportConfig(this.teachersService),
      file.buffer,
      user,
      getRequestMeta(request)
    );
    return apiSuccess("Teacher import completed", result);
  }

  @Get(":id")
  @RequirePermissions("teachers.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Teacher retrieved", await this.teachersService.findById(id));
  }

  @Post()
  @RequirePermissions("teachers.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher created",
      await this.teachersService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("teachers.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher updated",
      await this.teachersService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("teachers.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Teacher deleted",
      await this.teachersService.delete(id, user, getRequestMeta(request))
    );
  }
}
