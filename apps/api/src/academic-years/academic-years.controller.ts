import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { AcademicYearsService } from "./academic-years.service";

@Controller("academic-years")
export class AcademicYearsController extends MasterDataController {
  constructor(@Inject(AcademicYearsService) service: AcademicYearsService) {
    super("Academic years", service);
  }
}
