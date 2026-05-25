import { Controller, Post, Param, Body, UseGuards, RawBodyRequest, Req, Headers } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { StripeService } from "./providers/stripe.service";
import { PrismaService } from "../../common/prisma/prisma.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("payments")
@Controller({ path: "payments", version: "1" })
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":orderId/stripe/intent")
  createStripeIntent(
    @Param("orderId") orderId: string,
    @CurrentUser("id") userId: string
  ) {
    return this.paymentsService.initiateStripePayment(orderId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":orderId/bkash/create")
  createBkashPayment(
    @Param("orderId") orderId: string,
    @CurrentUser("id") userId: string
  ) {
    return this.paymentsService.initiateBkashPayment(orderId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(":orderId/cod/confirm")
  confirmCod(@Param("orderId") orderId: string) {
    return this.paymentsService.confirmCodPayment(orderId);
  }

  @Public()
  @Post("stripe/webhook")
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") signature: string
  ) {
    const event = this.stripeService.verifyWebhookSignature(req.rawBody as Buffer, signature);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as { id: string };
      await this.prisma.payment.updateMany({
        where: { gatewayTxnId: paymentIntent.id },
        data: { status: "COMPLETED", paidAt: new Date() },
      });

      const payment = await this.prisma.payment.findFirst({
        where: { gatewayTxnId: paymentIntent.id },
      });
      if (payment) {
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "CONFIRMED" },
        });
      }
    }

    return { received: true };
  }
}
