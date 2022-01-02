import { IsDate, IsNumber, IsOptional, Min, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

import { IsGreater } from '@common/decorators/class-validator';

export class GetDetailDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  fromDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @IsGreater('fromDate')
  toDate: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(18)
  driverAge?: number;
}
