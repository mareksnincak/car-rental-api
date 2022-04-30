import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { IdDto } from '@src/common/dtos/id.dto';

export class ReturnBookingDto extends IdDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mileage: number;
}
