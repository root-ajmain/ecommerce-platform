import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  SetMetadata,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CartService, AddCartItemDto, UpdateCartItemDto } from "./cart.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

export const Public = () => SetMetadata("isPublic", true);

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "cart", version: "1" })
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.getCart(user?.id, sessionId);
  }

  @Post("items")
  addItem(
    @Body() dto: AddCartItemDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.addItem(dto, user?.id, sessionId);
  }

  @Put("items/:itemId")
  updateItem(
    @Param("itemId") itemId: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.updateItem(itemId, dto, user?.id, sessionId);
  }

  @Delete("items/:itemId")
  removeItem(
    @Param("itemId") itemId: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.removeItem(itemId, user?.id, sessionId);
  }

  @Delete()
  clearCart(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.clearCart(user?.id, sessionId);
  }

  @Get("saved")
  getSavedItems(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.getSavedItems(user?.id, sessionId);
  }

  @Post("items/:itemId/save-for-later")
  saveForLater(
    @Param("itemId") itemId: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.saveForLater(itemId, user?.id, sessionId);
  }

  @Post("items/:itemId/move-to-cart")
  moveToCart(
    @Param("itemId") itemId: string,
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query("sessionId") sessionId?: string
  ) {
    return this.cartService.moveToCart(itemId, user?.id, sessionId);
  }

  @Post("merge")
  mergeCart(
    @CurrentUser() user: AuthenticatedUser,
    @Body("sessionId") sessionId: string
  ) {
    return this.cartService.mergeGuestCart(sessionId, user.id);
  }
}
