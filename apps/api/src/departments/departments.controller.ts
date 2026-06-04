import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { DepartmentsService } from "./departments.service";

@Controller("departments")
export class DepartmentsController extends MasterDataController {
  constructor(@Inject(DepartmentsService) service: DepartmentsService) {
    super("Departments", service);
  }
}
