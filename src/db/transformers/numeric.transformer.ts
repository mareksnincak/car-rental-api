import { ValueTransformer } from 'typeorm';

export class NumericTransformer implements ValueTransformer {
  to(value: number) {
    return value;
  }

  from(value: string) {
    return Number(value);
  }
}
