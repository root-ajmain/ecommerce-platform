import { Controller, Post, Headers, Body, RawBodyRequest, Req, UnauthorizedException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { Webhook } from "svix";

@ApiTags("webhooks")
@Controller({ path: "webhooks/clerk", version: "1" })
export class ClerkWebhookController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @Post()
  async handleClerkWebhook(
    @Headers("svix-id") svixId: string,
    @Headers("svix-timestamp") svixTimestamp: string,
    @Headers("svix-signature") svixSignature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    const webhookSecret = this.config.get<string>("CLERK_WEBHOOK_SECRET");
    if (!webhookSecret) throw new UnauthorizedException("Webhook secret not configured");

    const wh = new Webhook(webhookSecret);
    let event: { type: string; data: Record<string, unknown> };

    try {
      event = wh.verify(req.rawBody as Buffer, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as typeof event;
    } catch {
      throw new UnauthorizedException("Invalid webhook signature");
    }

    const { type, data } = event;

    if (type === "user.created" || type === "user.updated") {
      const emailAddresses = data.email_addresses as Array<{ email_address: string; id: string }>;
      const primaryEmailId = data.primary_email_address_id as string;
      const primaryEmail = emailAddresses.find((e) => e.id === primaryEmailId);

      await this.authService.syncClerkUser(data.id as string, {
        email: primaryEmail?.email_address ?? "",
        firstName: (data.first_name as string) ?? "",
        lastName: (data.last_name as string) ?? "",
        avatar: data.image_url as string | undefined,
        phone: data.phone_numbers
          ? (data.phone_numbers as Array<{ phone_number: string }>)[0]?.phone_number
          : undefined,
      });
    } else if (type === "user.deleted") {
      await this.authService.deleteClerkUser(data.id as string);
    }

    return { received: true };
  }
}
