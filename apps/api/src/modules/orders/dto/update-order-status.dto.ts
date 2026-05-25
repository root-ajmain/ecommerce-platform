import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateOrderStatusDto {
  @IsEnum([
    "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY",
    "DELIVERED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED", "ON_HOLD", "RETURNED",
  ])
  status!: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED" | "ON_HOLD" | "RETURNED";

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
