import {
  ValidationOptions,
  ValidationArguments,
  ValidateBy,
} from 'class-validator';

const validate = (value: unknown, args: ValidationArguments) => {
  const [relatedPropertyName] = args.constraints;
  const relatedValue = args.object[relatedPropertyName];

  return value > relatedValue;
};

const defaultMessage = ({ property, constraints }: ValidationArguments) => {
  return `${property} must be > ${constraints[0]}`;
};

export const IsGreater = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return ValidateBy(
    {
      name: 'IsGreater',
      constraints: [property],
      validator: {
        validate,
        defaultMessage,
      },
    },
    validationOptions,
  );
};
