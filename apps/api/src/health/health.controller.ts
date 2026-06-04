import { Controller, Get, Inject } from "@nestjs/common";

import { apiSuccess } from "../common/api-response";
import { HealthService } from "./health.service";

@Controller()
export class HealthController {
  constructor(@Inject(HealthService) private readonly healthService: HealthService) {}

  @Get("health")
  async getRootHealth() {
    return apiSuccess("Health check OK", await this.healthService.getHealth());
  }

  @Get("api/v1/health")
  async getPrefixedHealth() {
    return apiSuccess("Health check OK", await this.healthService.getHealth());
  }

  @Get("version")
  getVersion() {
    return apiSuccess("Version retrieved", this.healthService.getVersion());
  }
}
