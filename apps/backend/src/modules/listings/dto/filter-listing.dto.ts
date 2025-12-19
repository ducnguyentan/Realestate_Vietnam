import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from './create-listing.dto';

export class FilterListingDto {
  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @IsOptional()
  @IsUUID()
  propertyTypeId?: string;

  @IsOptional()
  @IsString()
  adminUnitCode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minArea?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxArea?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsString()
  direction?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;
}
