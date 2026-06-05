import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { GuardianPortalController } from "./guardian-portal.controller";
import { GuardianPortalService } from "./guardian-portal.service";

@Module({
  imports: [AuthModule],
  controllers: [GuardianPortalController],
  providers: [GuardianPortalService],
  exports: [GuardianPortalService]
})
export class GuardianPortalModule {}
