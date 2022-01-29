import { IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { IsGreater, MinFn } from '@common/decorators/class-validator';

export class GetPriceDto {
  @Type(() => Date)
  @IsDate()
  @MinFn(() => new Date())
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsGreater('fromDate')
  toDate: Date;

  @Type(() => Number)
  @IsNumber()
  @Min(18)
  driverAge?: number;
}
