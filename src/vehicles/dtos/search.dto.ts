import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { SearchDto } from '@common/dtos/search.dto';
import { ESortBy } from '@vehicles/types/search.type';

export class SearchVehiclesDto extends SearchDto {
  @IsOptional()
  @Transform(({ value }) => ESortBy[value] ?? value)
  @IsEnum(ESortBy, {
    message: `sortBy must be one of the following values: ${Object.keys(
      ESortBy,
    ).join(', ')}`,
  })
  sortBy = ESortBy.model;
}
