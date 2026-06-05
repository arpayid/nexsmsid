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
import { getStudentsImportConfig } from "./students.excel";
import { StudentsService } from "./students.service";

@Controller("students")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StudentsController {
  constructor(
    @Inject(StudentsService) private readonly studentsService: StudentsService,
    @Inject(ExcelImportService) private readonly excelImportService: ExcelImportService
  ) {}

  @Get()
  @RequirePermissions("students.view")
  async list(@Query() query: unknown) {
    const result = await this.studentsService.list(query);
    return apiSuccess("Students retrieved", result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total
    });
  }

  @Get("template")
  @RequirePermissions("students.import")
  async template(@Res() response: Response) {
    const buffer = await this.excelImportService.buildTemplate(getStudentsImportConfig(this.studentsService));
    response
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      .setHeader("Content-Disposition", `attachment; filename="students-template.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Get("export")
  @RequirePermissions("students.export")
  async export(@Res() response: Response) {
    const records = await this.studentsService.exportAll();
    const buffer = await this.excelImportService.exportRows(
      getStudentsImportConfig(this.studentsService),
      records
    );
    response
      .status(200)
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      .setHeader("Content-Disposition", `attachment; filename="students-export.xlsx"`)
      .setHeader("Content-Length", String(buffer.length))
      .end(buffer);
  }

  @Post("import")
  @RequirePermissions("students.import")
  @UseInterceptors(FileInterceptor("file"))
  async import(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser,
    @Body() _body: unknown
  ) {
    if (!file) {
      return apiSuccess("Student import failed", {
        totalRows: 0,
        successRows: 0,
        failedRows: 0,
        errors: [{ row: 0, message: "No file uploaded" }]
      });
    }
    const result = await this.excelImportService.importFromBuffer(
      getStudentsImportConfig(this.studentsService),
      file.buffer,
      user,
      getRequestMeta(request)
    );
    return apiSuccess("Student import completed", result);
  }

  @Get(":id")
  @RequirePermissions("students.view")
  async findById(@Param("id") id: string) {
    return apiSuccess("Student retrieved", await this.studentsService.findById(id));
  }

  @Post()
  @RequirePermissions("students.create")
  async create(
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student created",
      await this.studentsService.create(body, user, getRequestMeta(request))
    );
  }

  @Patch(":id")
  @RequirePermissions("students.update")
  async update(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student updated",
      await this.studentsService.update(id, body, user, getRequestMeta(request))
    );
  }

  @Delete(":id")
  @RequirePermissions("students.delete")
  async delete(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Req() request: RequestWithUser
  ) {
    return apiSuccess(
      "Student deleted",
      await this.studentsService.delete(id, user, getRequestMeta(request))
    );
  }
}
