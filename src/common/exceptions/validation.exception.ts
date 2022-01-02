import { ValidationError } from 'class-validator';

import { EXCEPTIONS } from '@common/constants/exception.constants';
import { AppException } from './default.exception';

const { code, type } = EXCEPTIONS.validation;

const message = 'Data validation has failed';

const parseValidationError = (error: ValidationError) => {
  const childrenErrors = error.children
    ?.flatMap((childError) => parseValidationError(childError))
    .map((childError) => `${error.property}.${childError}`);

  const firstLevelErrors = Object.values(error.constraints ?? {});
  return [...firstLevelErrors, ...childrenErrors];
};

export class ValidationAppException extends AppException {
  constructor(validationErrors: ValidationError[]) {
    const errors = validationErrors.flatMap((error) =>
      parseValidationError(error),
    );

    console.dir(validationErrors, { depth: 5 });

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
