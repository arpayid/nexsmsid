import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { ClassroomsService } from "./classrooms.service";

@Controller("classrooms")
export class ClassroomsController extends MasterDataController {
  constructor(@Inject(ClassroomsService) service: ClassroomsService) {
    super("Classrooms", service);
  }
}
