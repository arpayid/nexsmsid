import { Controller, Inject } from "@nestjs/common";

import { ExcelImportService } from "../excel/excel-import.service";
import { MasterDataController } from "../master-data/master-data-controller";
import { getSubjectsImportConfig } from "./subjects.excel";
import { SubjectsService } from "./subjects.service";

@Controller("subjects")
export class SubjectsController extends MasterDataController {
  constructor(
    @Inject(SubjectsService) private readonly subjectsService: SubjectsService,
    @Inject(ExcelImportService) excelImportService: ExcelImportService
  ) {
    super("Subjects", subjectsService as never, {
      excelImportService,
      getImportConfig: () => getSubjectsImportConfig(subjectsService),
      performExport: () => subjectsService.exportAll(),
      resourceKey: "subjects"
    });
  }
}
