import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  Min,
  MinDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { IsGreater } from '@common/decorators/class-validator';

class DriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(18)
  age: number;
}

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  fromDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsGreater('fromDate')
  toDate: Date;

  @Type(() => DriverDto)
  @IsObject()
  @ValidateNested()
  driver: DriverDto;
}
