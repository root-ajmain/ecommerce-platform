import { Controller, Post, Body, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CouponsService, ValidateCouponDto } from "./coupons.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

export const Public = () => SetMetadata("isPublic", true);

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("coupons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "coupons", version: "1" })
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post("validate")
  validate(
    @Body() dto: ValidateCouponDto,
    @CurrentUser() user: AuthenticatedUser | undefined
  ) {
    return this.couponsService.validate({ ...dto, userId: user?.id });
  }
}
