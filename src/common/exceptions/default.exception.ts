import { HttpException, HttpStatus } from '@nestjs/common';
import { TExceptionData } from '@common/types/exception.type';

export class AppException extends HttpException {
  public readonly logMessage: string;

  constructor(
    {
      code,
      type,
      message,
      detail,
      statusCode = HttpStatus.BAD_REQUEST,
    }: TExceptionData,
    logMessage: string,
  ) {
    super({ code, type, message, detail }, statusCode);

    this.logMessage = logMessage;
  }
}
