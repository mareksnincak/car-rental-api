import { EXCEPTIONS } from '@common/constants/exception.constants';
import { HttpStatus } from '@nestjs/common';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.unauthorized;

export class UnauthorizedAppException extends AppException {
  constructor(logMessage: string) {
    super(
      {
        code,
        type,
        message: 'Unauthorized.',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      logMessage,
    );
  }
}
