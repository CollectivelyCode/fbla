import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import helmet from "helmet";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import {ConfigService} from "@nestjs/config";
import {NewRelicInterceptor} from "./interceptors/NewRelic.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["warn", "error", "log", "verbose"]
  });
  const config = new DocumentBuilder()
      .setTitle("Rapid Attend")
      .setVersion("0.1.0")
      .build()
  app.useGlobalInterceptors(new NewRelicInterceptor())
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, document)
  const configService = app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: ["http://" + configService.get("APP_URL"), configService.get("APP_URL")],
    credentials: true
  })
  app.use(helmet())
  app.use(cookieParser())
  await app.listen(configService.get("PORT"));
}
bootstrap();
