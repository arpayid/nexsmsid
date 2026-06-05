import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";

import { apiSuccess } from "../common/api-response";
import { PublicPpdbService } from "./public-ppdb.service";
import { Public } from "../auth/decorators/public.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { PermissionGuard } from "../auth/guards/permission.guard";

@Controller("public/ppdb")
@UseGuards(JwtAuthGuard, PermissionGuard)
@Public()
export class PublicPpdbController {
  constructor(@Inject(PublicPpdbService) private readonly service: PublicPpdbService) {}

  @Get("active-period")
  async getActivePeriod() {
    return apiSuccess("Active PPDB period retrieved", await this.service.getActivePeriod());
  }

  @Post("register")
  async register(@Body() body: unknown) {
    return apiSuccess("PPDB registration submitted", await this.service.register(body));
  }
}
