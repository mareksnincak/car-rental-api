import { ValidationError } from 'class-validator';

import { EXCEPTIONS } from '@common/constants/exception.constants';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.validation;

const message = 'Data validation has failed';

export class ValidationAppException extends AppException {
  constructor(validationErrors: ValidationError[]) {
    const errors = validationErrors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );

    super(
      {
        code,
        type,
        message,
        detail: {
          errors,
        },
      },
      message,
    );
  }
}
