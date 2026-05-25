import { IsString, IsOptional, IsArray, IsEmail, ValidateNested, IsNumber, Min, IsEnum } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  variantId?: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingAddressId?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsEnum(["STRIPE", "SSLCOMMERZ", "BKASH", "NAGAD", "COD", "WALLET"])
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  guestPhone?: string;
}
