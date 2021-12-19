import { EXCEPTIONS } from '@common/constants/exception.constants';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.notFound;

export class NotFoundAppException extends AppException {
  constructor(resource: string, logMessage: string) {
    super(
      {
        code,
        type,
        message: `"${resource}" was not found.`,
        detail: {
          resource,
        },
      },
      logMessage,
    );
  }
}
