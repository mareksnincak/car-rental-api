import { IsIn, IsOptional } from 'class-validator';

import { ESortBy } from '@bookings/booking.constants';
import { PaginationDto } from '@src/common/dtos/pagination.dto';

export class GetBookingsDto extends PaginationDto {
  @IsOptional()
  @IsIn(Object.keys(ESortBy))
  sortBy: keyof typeof ESortBy = 'fromDate';
}
