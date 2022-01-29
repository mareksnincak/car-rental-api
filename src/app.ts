import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { ValidationAppException } from '@common/exceptions/validation.exception';
import { DefaultExceptionFilter } from '@common/exceptions/filters/default.exception-filter';
import { getLogLevels } from '@common/utils/logger.utils';

import { AppModule } from './app.module';

export async function bootstrap(portOverride?: number) {
  const app = await NestFactory.create(AppModule, { logger: getLogLevels() });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationAppException(errors),
    }),
  );
  app.useGlobalFilters(new DefaultExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(portOverride ?? configService.get('PORT'));
  return app;
}
