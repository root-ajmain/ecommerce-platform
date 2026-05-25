import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { StripeService } from "./providers/stripe.service";
import { BkashService } from "./providers/bkash.service";
import { SslcommerzService } from "./providers/sslcommerz.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private bkashService: BkashService,
    private sslcommerzService: SslcommerzService,
    private config: ConfigService
  ) {}

  async initiateStripePayment(orderId: string, userId: string) {
    const order = await this.getOrderForPayment(orderId, userId);

    const paymentIntent = await this.stripeService.createPaymentIntent(
      Number(order.totalAmount),
      "bdt",
      { orderId, orderNumber: order.orderNumber }
    );

    await this.prisma.payment.create({
      data: {
        orderId,
        method: "STRIPE",
        amount: order.totalAmount,
        currency: "BDT",
        gatewayTxnId: paymentIntent.id,
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async initiateBkashPayment(orderId: string, userId: string) {
    const order = await this.getOrderForPayment(orderId, userId);
    const frontendUrl = this.config.get<string>("NEXT_PUBLIC_APP_URL");

    const bkashPayment = await this.bkashService.createPayment(
      Number(order.totalAmount),
      orderId,
      `${frontendUrl}/checkout/bkash/callback`
    );

    if (bkashPayment.statusCode !== "0000") {
      throw new BadRequestException("bKash payment initiation failed");
    }

    await this.prisma.payment.create({
      data: {
        orderId,
        method: "BKASH",
        amount: order.totalAmount,
        currency: "BDT",
        gatewayTxnId: bkashPayment.paymentID,
      },
    });

    return { paymentUrl: bkashPayment.bkashURL, paymentId: bkashPayment.paymentID };
  }

  async initiateSslcommerzPayment(orderId: string, userId: string, customerInfo: { name: string; email: string; phone: string }) {
    const order = await this.getOrderForPayment(orderId, userId);
    const frontendUrl = this.config.get<string>("NEXT_PUBLIC_APP_URL");

    const result = await this.sslcommerzService.initPayment({
      orderId,
      amount: Number(order.totalAmount),
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      successUrl: `${frontendUrl}/checkout/sslcommerz/success`,
      failUrl: `${frontendUrl}/checkout/sslcommerz/fail`,
      cancelUrl: `${frontendUrl}/checkout/sslcommerz/cancel`,
    });

    return { paymentUrl: result.GatewayPageURL };
  }

  async confirmCodPayment(orderId: string) {
    await this.prisma.payment.create({
      data: {
        orderId,
        method: "COD",
        amount: (await this.prisma.order.findUniqueOrThrow({ where: { id: orderId }, select: { totalAmount: true } })).totalAmount,
        currency: "BDT",
        status: "PENDING",
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: "CONFIRMED" },
    });
  }

  private async getOrderForPayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
    });
    if (!order) throw new NotFoundException("Order not found");
    if (order.status !== "PENDING") throw new BadRequestException("Order already paid or cancelled");
    return order;
  }
}
