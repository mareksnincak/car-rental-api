import { IsDate, IsNumber, Min, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

import { IsGreater } from '@common/decorators/class-validator';

export class GetPriceDto {
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
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
