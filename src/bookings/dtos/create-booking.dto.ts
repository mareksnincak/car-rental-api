import { IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { MinFn } from '@common/decorators/class-validator';

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @Type(() => Date)
  @IsDate()
  @MinFn(() => new Date())
  toDate: Date;
}
