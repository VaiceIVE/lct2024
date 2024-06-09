/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
    origin:[
      "http://localhost:4200",
      "http://localhost:4200/",
      "http://127.0.0.1:4200",
      "http://127.0.0.1:4200/"
    ]
  })
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
