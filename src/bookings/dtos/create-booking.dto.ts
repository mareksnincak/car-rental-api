import { IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;
}
