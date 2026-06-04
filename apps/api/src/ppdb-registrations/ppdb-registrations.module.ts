import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PpdbDocumentsController } from "./ppdb-documents.controller";
import { PpdbRegistrationsController } from "./ppdb-registrations.controller";
import { PpdbRegistrationsService } from "./ppdb-registrations.service";

@Module({
  imports: [AuthModule],
  controllers: [PpdbRegistrationsController, PpdbDocumentsController],
  providers: [PpdbRegistrationsService]
})
export class PpdbRegistrationsModule {}
