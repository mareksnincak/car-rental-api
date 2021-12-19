import { IsDate, IsUUID, MinDate } from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { IsGreaterThan } from '@common/decorators/class-validator';

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @IsDate()
  @Type(() => Date)
  @MinDate(new Date())
  from: Date;

  @IsDate()
  @Type(() => Date)
  @IsGreaterThan('from')
  to: Date;
}
