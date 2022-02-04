import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AppException } from '../default.exception';
import { EXCEPTIONS } from '@common/constants/exception.constants';
import { TExceptionData } from '@common/types/exception.type';

const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;

const defaultExceptionData = {
  code: EXCEPTIONS.default.code,
  type: EXCEPTIONS.default.type,
  message: 'Unknown error occured.',
} as const;

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof NotFoundException) {
      Logger.log(exception);
      return response.sendStatus(HttpStatus.NOT_FOUND);
    }

    let status = defaultStatus;
    let exceptionData: TExceptionData = defaultExceptionData;

    if (exception instanceof AppException) {
      exceptionData = exception.getResponse() as TExceptionData;
      status = exception.getStatus();
      Logger.warn(exception.logMessage);
    } else if (exception instanceof Error) {
      Logger.error(exception.message, exception.stack);
    } else {
      Logger.error('Unhandled exception', exception);
    }

    return response.status(status).json({
      code: exceptionData.code,
      type: exceptionData.type,
      message: exceptionData.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      detail: exceptionData.detail,
    });
  }
}
