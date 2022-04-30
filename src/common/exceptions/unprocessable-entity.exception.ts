import { EXCEPTIONS } from '@common/constants/exception.constants';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.unprocessableEntity;

export class UnprocessableEntityAppException extends AppException {
  constructor({
    responseMessage,
    resource,
    logMessage,
  }: {
    responseMessage: string;
    resource: string;
    logMessage: string;
  }) {
    super(
      {
        code,
        type,
        message: responseMessage,
        detail: {
          resource,
        },
      },
      logMessage,
    );
  }
}
