import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  MaxLength,
  Min,
  IsUUID,
} from 'class-validator';

export enum TransactionType {
  SELL = 'sell',
  RENT = 'rent',
}

export class CreateListingDto {
  @IsEnum(TransactionType)
  transactionType: TransactionType = TransactionType.SELL;

  @IsUUID()
  propertyTypeId: string = '';

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string = '';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  adminUnitCode: string = '';

  @IsNotEmpty()
  @IsString()
  address: string = '';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  street?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaLand?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaFloor?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  frontage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  floors?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  direction?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  priceUnit?: string;

  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  legalStatus?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  ownershipType?: string;

  @IsOptional()
  @IsBoolean()
  isMortgaged?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(30)
  furniture?: string;
}
