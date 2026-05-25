export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "ON_HOLD"
  | "RETURNED";

export type PaymentMethod = "STRIPE" | "SSLCOMMERZ" | "BKASH" | "NAGAD" | "COD" | "WALLET";
export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
}

export interface CheckoutPayload {
  items: Array<{ productId: string; variantId?: string; quantity: number }>;
  shippingAddressId?: string;
  shippingAddress?: import("./user").AddressDto;
  billingAddressId?: string;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  guestEmail?: string;
  guestPhone?: string;
}
