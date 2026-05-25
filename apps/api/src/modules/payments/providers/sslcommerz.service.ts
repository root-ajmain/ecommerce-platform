import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SslcommerzService {
  constructor(private config: ConfigService) {}

  private get storeId() { return this.config.get<string>("SSLCOMMERZ_STORE_ID") ?? ""; }
  private get storePass() { return this.config.get<string>("SSLCOMMERZ_STORE_PASS") ?? ""; }
  private get isLive() { return this.config.get<string>("SSLCOMMERZ_IS_LIVE") === "true"; }

  private get baseUrl() {
    return this.isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";
  }

  async initPayment(params: {
    orderId: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    successUrl: string;
    failUrl: string;
    cancelUrl: string;
  }) {
    const payload = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePass,
      total_amount: params.amount.toFixed(2),
      currency: "BDT",
      tran_id: params.orderId,
      success_url: params.successUrl,
      fail_url: params.failUrl,
      cancel_url: params.cancelUrl,
      cus_name: params.customerName,
      cus_email: params.customerEmail,
      cus_phone: params.customerPhone,
      cus_add1: "N/A",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      product_name: "Order",
      product_category: "General",
      product_profile: "general",
    });

    const response = await fetch(`${this.baseUrl}/gwprocess/v4/api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString(),
    });

    return response.json();
  }

  async validatePayment(valId: string) {
    const url = `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${this.storeId}&store_passwd=${this.storePass}&format=json`;
    const response = await fetch(url);
    return response.json();
  }
}
