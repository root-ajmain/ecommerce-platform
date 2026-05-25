import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface AddCartItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException("Either userId or sessionId is required");
    }

    const where = userId ? { userId } : { sessionId };

    let cart = await this.prisma.cart.findFirst({ where });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: userId
          ? { userId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
          : { sessionId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      });
    }

    return cart;
  }

  async getCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          where: { savedForLater: false },
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
                inventory: { select: { quantity: true, reservedQuantity: true } },
              },
            },
            variant: {
              include: {
                inventory: { select: { quantity: true, reservedQuantity: true } },
                attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async addItem(dto: AddCartItemDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });
    if (!product || product.status !== "ACTIVE") {
      throw new NotFoundException("Product not found or not available");
    }

    if (dto.variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: dto.variantId },
      });
      if (!variant || variant.productId !== dto.productId || !variant.isActive) {
        throw new NotFoundException("Variant not found or not available");
      }
    }

    const existing = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId ?? null,
        savedForLater: false,
      },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
        include: { product: true, variant: true },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        userId,
        productId: dto.productId,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
      include: { product: true, variant: true },
    });
  }

  async updateItem(itemId: string, dto: UpdateCartItemDto, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException("Cart item not found");

    if (dto.quantity <= 0) {
      return this.removeItem(itemId, userId, sessionId);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
      include: { product: true, variant: true },
    });
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException("Cart item not found");

    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { message: "Cart cleared" };
  }

  async saveForLater(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException("Cart item not found");

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { savedForLater: true },
    });
  }

  async moveToCart(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });
    if (!item) throw new NotFoundException("Saved item not found");

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { savedForLater: false },
    });
  }

  async getSavedItems(userId?: string, sessionId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionId);

    return this.prisma.cartItem.findMany({
      where: { cartId: cart.id, savedForLater: true },
      include: {
        product: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
        variant: true,
      },
    });
  }

  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.prisma.cart.findFirst({ where: { sessionId } });
    if (!guestCart) return;

    const userCart = await this.getOrCreateCart(userId);

    const guestItems = await this.prisma.cartItem.findMany({
      where: { cartId: guestCart.id },
    });

    for (const item of guestItems) {
      const existing = await this.prisma.cartItem.findFirst({
        where: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
          savedForLater: item.savedForLater,
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            userId,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            savedForLater: item.savedForLater,
          },
        });
      }
    }

    await this.prisma.cart.delete({ where: { id: guestCart.id } });
  }
}
