import { Controller, Get, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { WishlistService } from "./wishlist.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("wishlist")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "wishlist", version: "1" })
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.getWishlist(user.id);
  }

  @Post()
  addToWishlist(
    @CurrentUser() user: AuthenticatedUser,
    @Body("productId") productId: string
  ) {
    return this.wishlistService.addToWishlist(user.id, productId);
  }

  @Delete(":productId")
  removeFromWishlist(
    @CurrentUser() user: AuthenticatedUser,
    @Param("productId") productId: string
  ) {
    return this.wishlistService.removeFromWishlist(user.id, productId);
  }

  @Delete()
  clearWishlist(@CurrentUser() user: AuthenticatedUser) {
    return this.wishlistService.clearWishlist(user.id);
  }

  @Get(":productId/check")
  checkItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param("productId") productId: string
  ) {
    return this.wishlistService.isInWishlist(user.id, productId);
  }
}
