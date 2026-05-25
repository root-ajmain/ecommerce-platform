import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum, IsArray, Min } from "class-validator";
import { Type, Transform } from "class-transformer";

export class ProductFilterDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(["asc", "desc"])
  sortOrder?: "asc" | "desc";

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  inStock?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (typeof value === "string" ? value.split(",") : value))
  tags?: string[];

  @IsOptional()
  @IsEnum(["DRAFT", "ACTIVE", "ARCHIVED", "OUT_OF_STOCK"])
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";

  @IsOptional()
  @IsEnum(["PHYSICAL", "DIGITAL", "VARIABLE", "BUNDLE"])
  type?: "PHYSICAL" | "DIGITAL" | "VARIABLE" | "BUNDLE";
}
