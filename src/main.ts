import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ValidationAppException } from '@common/exceptions/validation.exception';
import { DefaultExceptionFilter } from '@common/exceptions/filters/default.exception-filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationAppException(errors),
    }),
  );
  app.useGlobalFilters(new DefaultExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}

bootstrap();
