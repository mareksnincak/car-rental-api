import { EXCEPTIONS } from '@common/constants/exception.constants';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.conflict;

export class ConflictAppException extends AppException {
  constructor(resource: string, logMessage: string) {
    super(
      {
        code,
        type,
        message: `Could not save "${resource}" as it conflicts with existing resource.`,
        detail: {
          resource,
        },
      },
      logMessage,
    );
  }
}
