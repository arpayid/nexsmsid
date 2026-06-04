import "reflect-metadata";

import { Logger, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { RequestLoggingInterceptor } from "./common/interceptors/request-logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");
  const port = configService.getOrThrow<number>("API_PORT");
  const apiPrefix = configService.getOrThrow<string>("API_PREFIX").replace(/^\/+|\/+$/g, "");

  app.enableCors({
    origin: configService.getOrThrow<string>("WEB_ORIGIN")
  });
  app.enableShutdownHooks();
  app.setGlobalPrefix(apiPrefix, {
    exclude: [
      { path: "health", method: RequestMethod.GET },
      { path: `${apiPrefix}/health`, method: RequestMethod.GET }
    ]
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor(), new ResponseInterceptor());

  await app.listen(port);
  logger.log(`NexSMSID API listening on http://localhost:${port}`);
  logger.log(`API prefix enabled at /${apiPrefix}`);
}

void bootstrap();
