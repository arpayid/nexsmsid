import { Module } from "@nestjs/common";
import { PublicPpdbController } from "./public-ppdb.controller";
import { PublicPpdbService } from "./public-ppdb.service";

@Module({
  controllers: [PublicPpdbController],
  providers: [PublicPpdbService]
})
export class PublicPpdbModule {}
