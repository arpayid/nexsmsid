import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { SubjectsService } from "./subjects.service";

@Controller("subjects")
export class SubjectsController extends MasterDataController {
  constructor(@Inject(SubjectsService) service: SubjectsService) {
    super("Subjects", service);
  }
}
