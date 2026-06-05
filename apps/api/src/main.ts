import "reflect-metadata";

import { Logger, RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { json, urlencoded } from "express";

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
  const nodeEnv = configService.getOrThrow<string>("NODE_ENV");

  // Security: Helmet
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: nodeEnv === "production" ? undefined : false,
  }));

  // Security: CORS
  const corsOrigin = configService.getOrThrow<string>("WEB_ORIGIN");
  app.enableCors({
    origin: corsOrigin.split(",").map(o => o.trim()),
    credentials: true,
  });

  // Security: Body Size Limits
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ extended: true, limit: "10mb" }));

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
  
  logger.log(`NexSMSID API [${nodeEnv}] listening on http://localhost:${port}`);
  logger.log(`API prefix enabled at /${apiPrefix}`);
  logger.log(`CORS allowed for: ${corsOrigin}`);
}

void bootstrap();
