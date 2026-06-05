import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DatabaseModule } from "../database/database.module";
import { PublicPpdbController } from "./public-ppdb.controller";
import { PublicPpdbService } from "./public-ppdb.service";

@Module({
  imports: [AuthModule, DatabaseModule],
  controllers: [PublicPpdbController],
  providers: [PublicPpdbService]
})
export class PublicPpdbModule {}
