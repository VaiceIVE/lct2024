import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  app.use(cookieParser())
  app.use(bodyParser.json({limit: '100mb'}));
  app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
  app.enableCors({
    credentials: true,
    origin:[
      "http://localhost:4200",
      "http://localhost:4200/",
      "http://127.0.0.1:4200",
      "http://127.0.0.1:4200/",
      "https://teplai.adera-team.ru"
    ]
  })

  const config = new DocumentBuilder()
    .setTitle('Teplai gateway API')
    .setDescription('Предоставляет основной функционал взаимодействия с сервисом и его микросервисами')
    .setVersion('1.0')
    .addTag('teplai')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();
