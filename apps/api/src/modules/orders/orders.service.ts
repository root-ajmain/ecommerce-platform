import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Prisma } from "@repo/db";
import { nanoid } from "nanoid";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private generateOrderNumber(): string {
    return `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;
  }

  async createOrder(dto: CreateOrderDto, userId?: string) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      include: { inventory: true, variants: { include: { inventory: true } } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException("One or more products unavailable");
    }

    let subtotal = 0;
    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new BadRequestException(`Product ${item.productId} not found`);

      let price = Number(product.price);
      let imageUrl = "";

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) throw new BadRequestException(`Variant ${item.variantId} not found`);
        price = Number(variant.price);

        if (variant.inventory && variant.inventory.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
      } else if (product.inventory) {
        if (product.inventory.quantity < item.quantity && !product.inventory.allowBackorder) {
          throw new BadRequestException(`Insufficient stock for ${product.name}`);
        }
      }

      const totalPrice = price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: product.name,
        sku: product.sku ?? undefined,
        price,
        quantity: item.quantity,
        totalPrice,
        isDigital: product.isDigital,
      });
    }

    let discountAmount = 0;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: dto.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        throw new BadRequestException("Invalid coupon code");
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException("Coupon has expired");
      }
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new BadRequestException("Coupon usage limit reached");
      }
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        throw new BadRequestException(
          `Minimum order amount for this coupon is ${coupon.minOrderAmount}`
        );
      }

      if (coupon.type === "PERCENTAGE") {
        discountAmount = (subtotal * Number(coupon.value)) / 100;
        if (coupon.maxDiscountAmount) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
        }
      } else if (coupon.type === "FIXED_AMOUNT") {
        discountAmount = Math.min(Number(coupon.value), subtotal);
      }

      couponId = coupon.id;
    }

    const shippingCost = dto.shippingMethod === "express" ? 150 : 60;
    const totalAmount = subtotal - discountAmount + shippingCost;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: this.generateOrderNumber(),
          userId,
          guestEmail: dto.guestEmail,
          guestPhone: dto.guestPhone,
          subtotal,
          shippingCost,
          discountAmount,
          couponId,
          couponCode: dto.couponCode?.toUpperCase(),
          couponDiscount: discountAmount,
          totalAmount,
          shippingAddressId: dto.shippingAddressId,
          shippingMethod: dto.shippingMethod,
          notes: dto.notes,
          items: { createMany: { data: orderItems } },
          statusHistory: {
            create: { status: "PENDING", notes: "Order placed" },
          },
        },
        include: { items: true },
      });

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usageCount: { increment: 1 } },
        });
        if (userId) {
          await tx.couponUsage.create({
            data: { couponId, userId, orderId: newOrder.id },
          });
        }
      }

      for (const item of dto.items) {
        if (item.variantId) {
          await tx.variantInventory.updateMany({
            where: { variantId: item.variantId },
            data: { reservedQuantity: { increment: item.quantity } },
          });
        } else {
          await tx.inventory.updateMany({
            where: { productId: item.productId },
            data: { reservedQuantity: { increment: item.quantity } },
          });
        }
      }

      return newOrder;
    });

    return order;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: { include: { attributeValues: { include: { attributeValue: true } } } } } },
        payments: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        shipments: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!order) throw new NotFoundException(`Order ${id} not found`);
    if (userId && order.userId !== userId) throw new ForbiddenException();

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, adminId: string) {
    const order = await this.findById(id);

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id },
        data: {
          status: dto.status,
          ...(dto.status === "DELIVERED" && { deliveredAt: new Date() }),
          ...(dto.status === "CANCELLED" && { cancelledAt: new Date(), cancelReason: dto.notes }),
          ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber }),
        },
      }),
      this.prisma.orderStatusHistory.create({
        data: { orderId: id, status: dto.status, notes: dto.notes, createdById: adminId },
      }),
    ]);

    if (dto.status === "CONFIRMED") {
      for (const item of order.items) {
        if (item.variantId) {
          await this.prisma.variantInventory.updateMany({
            where: { variantId: item.variantId },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        } else {
          await this.prisma.inventory.updateMany({
            where: { productId: item.productId },
            data: {
              quantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
        await this.prisma.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: item.quantity } },
        });
      }
    }

    return this.findById(id);
  }

  async cancelOrder(id: string, userId: string, reason?: string) {
    const order = await this.findById(id, userId);

    const cancelableStatuses = ["PENDING", "CONFIRMED"];
    if (!cancelableStatuses.includes(order.status)) {
      throw new BadRequestException("Order cannot be cancelled at this stage");
    }

    return this.updateStatus(id, { status: "CANCELLED", notes: reason }, userId);
  }

  async getAdminList(page = 1, limit = 20, status?: string) {
    const where = status ? { status: status as "PENDING" } : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          items: { select: { quantity: true } },
          payments: { select: { status: true, method: true }, take: 1 },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
