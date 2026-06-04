import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.getOrThrow<string>("DATABASE_URL")
        }
      },
      log: ["warn", "error"]
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Connected to PostgreSQL via Prisma");
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
