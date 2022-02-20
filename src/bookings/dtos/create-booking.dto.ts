import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { IsGreater, MinFn } from '@common/decorators/class-validator';

class DriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(18)
  age: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  idNumber: string;
}

export class CreateBookingDto extends SearchDto {
  @IsUUID()
  vehicleId: string;

  @Type(() => Date)
  @IsDate()
  @MinFn(() => new Date())
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
