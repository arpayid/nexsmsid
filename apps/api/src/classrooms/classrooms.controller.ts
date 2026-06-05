import { Controller, Inject } from "@nestjs/common";

import { ExcelImportService } from "../excel/excel-import.service";
import { MasterDataController } from "../master-data/master-data-controller";
import { getClassroomsImportConfig } from "./classrooms.excel";
import { ClassroomsService } from "./classrooms.service";

@Controller("classrooms")
export class ClassroomsController extends MasterDataController {
  constructor(
    @Inject(ClassroomsService) private readonly classroomsService: ClassroomsService,
    @Inject(ExcelImportService) excelImportService: ExcelImportService
  ) {
    super("Classrooms", classroomsService as never, {
      excelImportService,
      getImportConfig: () => getClassroomsImportConfig(classroomsService),
      performExport: () => classroomsService.exportAll(),
      resourceKey: "classrooms"
    });
  }
}
