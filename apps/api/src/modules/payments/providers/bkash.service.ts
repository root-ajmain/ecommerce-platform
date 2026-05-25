import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

interface BkashTokenResponse {
  id_token: string;
  token_type: string;
  expires_in: number;
}

interface BkashCreatePaymentResponse {
  paymentID: string;
  bkashURL: string;
  statusCode: string;
  statusMessage: string;
}

@Injectable()
export class BkashService {
  private readonly logger = new Logger(BkashService.name);
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get<string>("BKASH_BASE_URL") ?? "";
  }

  private get headers() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: this.config.get<string>("BKASH_USERNAME") ?? "",
      password: this.config.get<string>("BKASH_PASSWORD") ?? "",
    };
  }

  async grantToken(): Promise<string> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        app_key: this.config.get("BKASH_APP_KEY"),
        app_secret: this.config.get("BKASH_APP_SECRET"),
      }),
    });

    const data = (await response.json()) as BkashTokenResponse;
    this.token = data.id_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 60) * 1000);
    return this.token;
  }

  async createPayment(amount: number, orderId: string, callbackUrl: string): Promise<BkashCreatePaymentResponse> {
    const token = await this.grantToken();

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
      method: "POST",
      headers: { ...this.headers, Authorization: token },
      body: JSON.stringify({
        mode: "0011",
        payerReference: orderId,
        callbackURL: callbackUrl,
        amount: amount.toFixed(2),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: orderId,
      }),
    });

    return response.json() as Promise<BkashCreatePaymentResponse>;
  }

  async executePayment(paymentId: string) {
    const token = await this.grantToken();

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/execute`, {
      method: "POST",
      headers: { ...this.headers, Authorization: token },
      body: JSON.stringify({ paymentID: paymentId }),
    });

    return response.json();
  }

  async queryPayment(paymentId: string) {
    const token = await this.grantToken();

    const response = await fetch(`${this.baseUrl}/tokenized/checkout/payment/status`, {
      method: "POST",
      headers: { ...this.headers, Authorization: token },
      body: JSON.stringify({ paymentID: paymentId }),
    });

    return response.json();
  }
}
