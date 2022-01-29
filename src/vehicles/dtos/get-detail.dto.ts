import { IsDate, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { IsGreater, MinFn } from '@common/decorators/class-validator';

export class GetDetailDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinFn(() => new Date())
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
