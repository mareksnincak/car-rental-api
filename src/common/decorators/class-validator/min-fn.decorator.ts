import {
  ValidationOptions,
  ValidationArguments,
  ValidateBy,
} from 'class-validator';

const validate = (value: unknown, args: ValidationArguments) => {
  return value > args.constraints[0]();
};

const defaultMessage = ({ property, constraints }: ValidationArguments) => {
  return `${property} must be > ${constraints[0]()}`;
};

export const MinFn = (
  minFn: () => unknown,
  validationOptions?: ValidationOptions,
) => {
  return ValidateBy(
    {
      name: 'MinFn',
      constraints: [minFn],
      validator: {
        validate,
        defaultMessage,
      },
    },
    validationOptions,
  );
};
