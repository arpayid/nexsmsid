import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { RoomsService } from "./rooms.service";

@Controller("rooms")
export class RoomsController extends MasterDataController {
  constructor(@Inject(RoomsService) service: RoomsService) {
    super("Rooms", service);
  }
}
