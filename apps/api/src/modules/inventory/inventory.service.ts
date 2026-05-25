import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { InventoryMovementType, Prisma } from "@repo/db";

export interface AdjustInventoryDto {
  quantity: number;
  type: InventoryMovementType;
  notes?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface AdjustVariantInventoryDto extends AdjustInventoryDto {
  variantId: string;
}

export interface LowStockFilterDto {
  page?: number;
  limit?: number;
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getInventory(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: { select: { id: true, name: true, sku: true, status: true } },
        movements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!inventory) throw new NotFoundException(`Inventory for product ${productId} not found`);
    return inventory;
  }

  async adjustInventory(productId: string, dto: AdjustInventoryDto, createdById?: string) {
    const inventory = await this.prisma.inventory.findUnique({ where: { productId } });
    if (!inventory) throw new NotFoundException(`Inventory for product ${productId} not found`);

    const quantityBefore = inventory.quantity;
    let quantityAfter: number;

    if (dto.type === "ADJUSTMENT" || dto.type === "INITIAL") {
      quantityAfter = dto.quantity;
    } else if (dto.type === "PURCHASE" || dto.type === "RETURN") {
      quantityAfter = quantityBefore + dto.quantity;
    } else if (dto.type === "SALE" || dto.type === "DAMAGE" || dto.type === "TRANSFER") {
      if (quantityBefore < dto.quantity) {
        throw new BadRequestException("Insufficient stock");
      }
      quantityAfter = quantityBefore - dto.quantity;
    } else {
      quantityAfter = quantityBefore + dto.quantity;
    }

    const [updatedInventory] = await this.prisma.$transaction([
      this.prisma.inventory.update({
        where: { productId },
        data: { quantity: quantityAfter },
      }),
      this.prisma.inventoryMovement.create({
        data: {
          inventoryId: inventory.id,
          type: dto.type,
          quantity: dto.quantity,
          quantityBefore,
          quantityAfter,
          notes: dto.notes,
          referenceId: dto.referenceId,
          referenceType: dto.referenceType,
          createdById,
        },
      }),
    ]);

    return updatedInventory;
  }

  async adjustVariantInventory(dto: AdjustVariantInventoryDto, createdById?: string) {
    const inventory = await this.prisma.variantInventory.findUnique({
      where: { variantId: dto.variantId },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory for variant ${dto.variantId} not found`);
    }

    const quantityBefore = inventory.quantity;
    let quantityAfter: number;

    if (dto.type === "ADJUSTMENT" || dto.type === "INITIAL") {
      quantityAfter = dto.quantity;
    } else if (dto.type === "PURCHASE" || dto.type === "RETURN") {
      quantityAfter = quantityBefore + dto.quantity;
    } else {
      if (quantityBefore < dto.quantity) {
        throw new BadRequestException("Insufficient stock");
      }
      quantityAfter = quantityBefore - dto.quantity;
    }

    const [updatedInventory] = await this.prisma.$transaction([
      this.prisma.variantInventory.update({
        where: { variantId: dto.variantId },
        data: { quantity: quantityAfter },
      }),
      this.prisma.inventoryMovement.create({
        data: {
          variantInventoryId: inventory.id,
          type: dto.type,
          quantity: dto.quantity,
          quantityBefore,
          quantityAfter,
          notes: dto.notes,
          referenceId: dto.referenceId,
          referenceType: dto.referenceType,
          createdById,
        },
      }),
    ]);

    return updatedInventory;
  }

  async getLowStock(filter: LowStockFilterDto = {}) {
    const { page = 1, limit = 20 } = filter;

    const rawData = await this.prisma.$queryRaw<
      Array<{
        id: string;
        productId: string;
        quantity: number;
        reservedQuantity: number;
        lowStockThreshold: number;
        trackQuantity: boolean;
        allowBackorder: boolean;
      }>
    >`
      SELECT i.* FROM inventory i
      JOIN products p ON p.id = i."productId"
      WHERE i."trackQuantity" = true
        AND p.status = 'ACTIVE'
        AND i.quantity <= i."lowStockThreshold"
      ORDER BY i.quantity ASC
      LIMIT ${limit} OFFSET ${(page - 1) * limit}
    `;

    const total = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) FROM inventory i
      JOIN products p ON p.id = i."productId"
      WHERE i."trackQuantity" = true
        AND p.status = 'ACTIVE'
        AND i.quantity <= i."lowStockThreshold"
    `;

    const productIds = rawData.map((r) => r.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        sku: true,
        status: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const enriched = rawData.map((inv) => ({ ...inv, product: productMap.get(inv.productId) }));
    const count = Number(total[0]?.count ?? 0);

    return {
      data: enriched,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async getMovements(productId: string, page = 1, limit = 20) {
    const inventory = await this.prisma.inventory.findUnique({ where: { productId } });
    if (!inventory) throw new NotFoundException(`Inventory for product ${productId} not found`);

    const [data, total] = await Promise.all([
      this.prisma.inventoryMovement.findMany({
        where: { inventoryId: inventory.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.inventoryMovement.count({ where: { inventoryId: inventory.id } }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateThreshold(productId: string, lowStockThreshold: number) {
    const inventory = await this.prisma.inventory.findUnique({ where: { productId } });
    if (!inventory) throw new NotFoundException(`Inventory for product ${productId} not found`);

    return this.prisma.inventory.update({
      where: { productId },
      data: { lowStockThreshold },
    });
  }
}
