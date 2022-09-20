import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exceptionFilter/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      // stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const keys = Object.keys(e.constraints);
          keys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints[ckey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(
          errorsForResponse,
          /* errors.map((e) => {
            return e.constraints;
          }), */
        );
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(5000);
}
bootstrap();
