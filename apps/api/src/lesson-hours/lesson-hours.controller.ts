import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { LessonHoursService } from "./lesson-hours.service";

@Controller("lesson-hours")
export class LessonHoursController extends MasterDataController {
  constructor(@Inject(LessonHoursService) service: LessonHoursService) {
    super("Lesson hours", service);
  }
}
