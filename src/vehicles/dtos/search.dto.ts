import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
  MinDate,
  ValidateIf,
} from 'class-validator';

import { SearchDto } from '@common/dtos/search.dto';
import { EFuel, ESortBy, ETransmission } from '@vehicles/vehicle.type';
import { Transform, Type } from 'class-transformer';
import { IsGreater } from '@common/decorators/class-validator';

export class SearchVehiclesDto extends SearchDto {
  @ValidateIf(({ toDate }) => !!toDate)
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  fromDate?: Date;

  @ValidateIf(({ fromDate }) => !!fromDate)
  @Type(() => Date)
  @IsDate()
  @IsGreater('fromDate')
  toDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(18)
  driverAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  seatsMin = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  seatsMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  powerMin = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  powerMax?: number;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ETransmission, { each: true })
  transmission = Object.values(ETransmission);

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(EFuel, { each: true })
  fuel = Object.values(EFuel);

  @IsOptional()
  @IsIn(Object.keys(ESortBy))
  sortBy: keyof typeof ESortBy = 'price';
}
