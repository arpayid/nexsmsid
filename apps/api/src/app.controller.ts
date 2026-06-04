import { Controller, Get } from "@nestjs/common";

import { apiSuccess } from "./common/api-response";

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return apiSuccess("NexSMSID API is running", {
      name: "NexSMSID API",
      status: "ok",
      health: "/api/v1/health",
      version: "/api/v1/version"
    });
  }
}
