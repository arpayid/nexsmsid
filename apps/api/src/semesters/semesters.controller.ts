import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { SemestersService } from "./semesters.service";

@Controller("semesters")
export class SemestersController extends MasterDataController {
  constructor(@Inject(SemestersService) service: SemestersService) {
    super("Semesters", service);
  }
}
