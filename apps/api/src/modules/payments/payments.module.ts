import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { StripeService } from "./providers/stripe.service";
import { BkashService } from "./providers/bkash.service";
import { SslcommerzService } from "./providers/sslcommerz.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, BkashService, SslcommerzService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
