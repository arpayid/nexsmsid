import { Controller, Inject } from "@nestjs/common";

import { MasterDataController } from "../master-data/master-data-controller";
import { PaymentCategoriesService } from "./payment-categories.service";

@Controller("payment-categories")
export class PaymentCategoriesController extends MasterDataController {
  constructor(@Inject(PaymentCategoriesService) service: PaymentCategoriesService) {
    super("Payment categories", service);
  }
}
