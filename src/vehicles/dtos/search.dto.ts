import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { MinFn } from '@common/decorators/class-validator';
import {
  ESortBy,
  BODY_STYLES,
  FUELS,
  TRANSMISSIONS,
} from '@vehicles/vehicle.constants';

export class SearchVehiclesDto extends SearchDto {
  @Type(() => Date)
  @IsDate()
  @MinFn(() => new Date())
  toDate: Date;

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
  @IsIn(TRANSMISSIONS, { each: true })
  transmissions = TRANSMISSIONS;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(FUELS, { each: true })
  fuels = FUELS;

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayNotEmpty()
  @IsIn(BODY_STYLES, { each: true })
  bodyStyles = BODY_STYLES;

  @IsOptional()
  @IsIn(Object.keys(ESortBy))
  sortBy: keyof typeof ESortBy = 'price';
}
