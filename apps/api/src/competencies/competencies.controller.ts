import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { CompetenciesService } from "./competencies.service";

@Controller("competencies")
export class CompetenciesController extends MasterDataController {
  constructor(@Inject(CompetenciesService) service: CompetenciesService) {
    super("Competencies", service);
  }
}
