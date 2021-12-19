import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ESortDirection } from '@common/types/pagination.type';

export class SearchDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize = 10;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt'])
  sortBy = 'createdAt';

  @IsOptional()
  @IsString()
  @IsEnum(ESortDirection)
  sortDirection = ESortDirection.asc;

  @IsOptional()
  @IsString()
  query = '';
}
