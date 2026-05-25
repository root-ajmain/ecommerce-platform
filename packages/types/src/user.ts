export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" | "VENDOR";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED" | "PENDING_VERIFICATION";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  loyaltyPoints: number;
  walletBalance: number;
  createdAt: Date;
}

export interface AddressDto {
  id?: string;
  type?: "SHIPPING" | "BILLING" | "BOTH";
  isDefault?: boolean;
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
