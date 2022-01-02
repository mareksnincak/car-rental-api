import { IsDate, IsUUID, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { IsGreater } from '@common/decorators/class-validator';

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  fromDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsGreater('fromDate')
  toDate: Date;
}
