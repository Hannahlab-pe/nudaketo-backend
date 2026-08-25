import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProductSizeDto {
  @IsString() @MaxLength(40) sizeKey: string;
  @IsString() @MaxLength(60) label: string;
  @IsString() @MaxLength(60) size: string;
  @IsString() @MaxLength(60) pieces: string;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsInt() sortOrder?: number;
}

export class CreateProductDto {
  @IsString() @MaxLength(120) slug: string;
  @IsString() @MaxLength(120) name: string;
  @IsString() @MaxLength(40) category: string;
  @IsString() @MaxLength(120) tagline: string;
  @IsString() @MaxLength(500) image: string;
  @IsString() @MaxLength(500) imageDetail: string;
  @IsString() @MaxLength(400) shortDesc: string;
  @IsString() description: string;

  @IsArray() @IsString({ each: true }) @ArrayMaxSize(30) highlights: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(40) ingredients?: string[];

  @IsOptional() @IsString() @MaxLength(80) nutriServing?: string | null;
  @IsOptional() @IsInt() @Min(0) nutriKcal?: number | null;
  @IsOptional() @IsString() @MaxLength(20) nutriFat?: string | null;
  @IsOptional() @IsString() @MaxLength(20) nutriCarbs?: string | null;
  @IsOptional() @IsString() @MaxLength(20) nutriProtein?: string | null;

  @IsOptional() @IsString() @MaxLength(40) badge?: string | null;
  @IsString() @MaxLength(80) accentClass: string;
  @IsString() @MaxLength(160) btnClass: string;
  @IsString() @MaxLength(80) cardBg: string;

  @IsOptional() @IsString() @MaxLength(40) protein?: string | null;
  @IsOptional() @IsString() @MaxLength(60) netWeight?: string | null;
  @IsString() @MaxLength(120) packaging: string;

  @IsOptional() @IsBoolean() refrigerated?: boolean;
  @IsOptional() @IsInt() @Min(0) stock?: number | null;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() active?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSizeDto)
  @ArrayMaxSize(6)
  sizes: ProductSizeDto[];
}

/** Igual que crear, pero todo opcional (PATCH parcial desde el panel). */
export class UpdateProductDto {
  @IsOptional() @IsString() @MaxLength(120) slug?: string;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(40) category?: string;
  @IsOptional() @IsString() @MaxLength(120) tagline?: string;
  @IsOptional() @IsString() @MaxLength(500) image?: string;
  @IsOptional() @IsString() @MaxLength(500) imageDetail?: string;
  @IsOptional() @IsString() @MaxLength(400) shortDesc?: string;
  @IsOptional() @IsString() description?: string;

  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(30) highlights?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) @ArrayMaxSize(40) ingredients?: string[];

  @IsOptional() @IsString() @MaxLength(80) nutriServing?: string | null;
  @IsOptional() @IsInt() @Min(0) nutriKcal?: number | null;
  @IsOptional() @IsString() @MaxLength(20) nutriFat?: string | null;
  @IsOptional() @IsString() @MaxLength(20) nutriCarbs?: string | null;
  @IsOptional() @IsString() @MaxLength(20) nutriProtein?: string | null;

  @IsOptional() @IsString() @MaxLength(40) badge?: string | null;
  @IsOptional() @IsString() @MaxLength(80) accentClass?: string;
  @IsOptional() @IsString() @MaxLength(160) btnClass?: string;
  @IsOptional() @IsString() @MaxLength(80) cardBg?: string;

  @IsOptional() @IsString() @MaxLength(40) protein?: string | null;
  @IsOptional() @IsString() @MaxLength(60) netWeight?: string | null;
  @IsOptional() @IsString() @MaxLength(120) packaging?: string;

  @IsOptional() @IsBoolean() refrigerated?: boolean;
  @IsOptional() @IsInt() @Min(0) stock?: number | null;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSizeDto)
  @ArrayMaxSize(6)
  sizes?: ProductSizeDto[];
}
