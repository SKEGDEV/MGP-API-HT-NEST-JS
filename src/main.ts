import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationExceptionFilter } from './common/filter/validationException.filter';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsHttpFilter } from './common/filter/http-exception.filter';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ValidationExceptionFilter(), new AllExceptionsHttpFilter()); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('API Teachers Management')
    .setDescription('An API for monolithic application for teachers management')
    .setVersion('1.0')
    .addTag('teachers')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token')
    .build();

  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
