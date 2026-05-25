import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, Min, IsUrl } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductImageDto {
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsEnum(["PHYSICAL", "DIGITAL", "VARIABLE", "BUNDLE"])
  type!: "PHYSICAL" | "DIGITAL" | "VARIABLE" | "BUNDLE";

  @IsEnum(["DRAFT", "ACTIVE", "ARCHIVED", "OUT_OF_STOCK"])
  status!: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costPerItem?: number;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestseller?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsArray()
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @IsOptional()
  @IsArray()
  variants?: unknown[];

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDesc?: string;
}
