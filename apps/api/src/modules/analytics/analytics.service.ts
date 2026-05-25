import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

export interface DateRangeDto {
  startDate?: string;
  endDate?: string;
  period?: "today" | "week" | "month" | "year";
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private getDateRange(dto: DateRangeDto): { start: Date; end: Date } {
    const end = dto.endDate ? new Date(dto.endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    let start: Date;
    if (dto.startDate) {
      start = new Date(dto.startDate);
      start.setHours(0, 0, 0, 0);
    } else {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      switch (dto.period) {
        case "today":
          break;
        case "week":
          start.setDate(start.getDate() - 7);
          break;
        case "year":
          start.setFullYear(start.getFullYear() - 1);
          break;
        case "month":
        default:
          start.setDate(start.getDate() - 30);
      }
    }

    return { start, end };
  }

  async getRevenueStats(dto: DateRangeDto = {}) {
    const { start, end } = this.getDateRange(dto);

    const [currentPeriod, previousPeriod] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { totalAmount: true, discountAmount: true, shippingCost: true },
        _count: { id: true },
      }),
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(start.getTime() - (end.getTime() - start.getTime())),
            lt: start,
          },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        _sum: { totalAmount: true },
        _count: { id: true },
      }),
    ]);

    const currentRevenue = Number(currentPeriod._sum.totalAmount ?? 0);
    const previousRevenue = Number(previousPeriod._sum.totalAmount ?? 0);
    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: currentPeriod._count.id,
      totalDiscount: Number(currentPeriod._sum.discountAmount ?? 0),
      totalShipping: Number(currentPeriod._sum.shippingCost ?? 0),
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      previousRevenue,
      averageOrderValue:
        currentPeriod._count.id > 0
          ? currentRevenue / currentPeriod._count.id
          : 0,
    };
  }

  async getOrderStats(dto: DateRangeDto = {}) {
    const { start, end } = this.getDateRange(dto);

    const statusCounts = await this.prisma.order.groupBy({
      by: ["status"],
      where: { createdAt: { gte: start, lte: end } },
      _count: { id: true },
      _sum: { totalAmount: true },
    });

    const dailyOrders = await this.prisma.$queryRaw<
      Array<{ date: string; count: bigint; revenue: number }>
    >`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count,
        SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= ${start} AND created_at <= ${end}
        AND status NOT IN ('CANCELLED', 'REFUNDED')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    return {
      byStatus: statusCounts.map((s) => ({
        status: s.status,
        count: s._count.id,
        revenue: Number(s._sum.totalAmount ?? 0),
      })),
      daily: dailyOrders.map((d) => ({
        date: d.date,
        count: Number(d.count),
        revenue: Number(d.revenue),
      })),
    };
  }

  async getTopProducts(dto: DateRangeDto = {}, limit = 10) {
    const { start, end } = this.getDateRange(dto);

    const topProducts = await this.prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
      },
      _sum: { quantity: true, totalPrice: true },
      _count: { id: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: limit,
    });

    const productIds = topProducts.map((p) => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    return topProducts.map((item) => ({
      product: productMap.get(item.productId),
      totalSold: item._sum.quantity ?? 0,
      totalRevenue: Number(item._sum.totalPrice ?? 0),
      orderCount: item._count.id,
    }));
  }

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
    });
  }

  async getCustomerStats(dto: DateRangeDto = {}) {
    const { start, end } = this.getDateRange(dto);

    const [totalCustomers, newCustomers, activeCustomers] = await Promise.all([
      this.prisma.user.count({ where: { role: "CUSTOMER" } }),
      this.prisma.user.count({
        where: { role: "CUSTOMER", createdAt: { gte: start, lte: end } },
      }),
      this.prisma.user.count({
        where: {
          role: "CUSTOMER",
          orders: { some: { createdAt: { gte: start, lte: end } } },
        },
      }),
    ]);

    return { totalCustomers, newCustomers, activeCustomers };
  }

  async getInventorySummary() {
    const [totalProducts, outOfStock, lowStock] = await Promise.all([
      this.prisma.product.count({ where: { status: "ACTIVE" } }),
      this.prisma.inventory.count({
        where: { quantity: 0, product: { status: "ACTIVE" } },
      }),
      this.prisma.$queryRaw<Array<{ count: bigint }>>`
        SELECT COUNT(*) FROM inventory i
        JOIN products p ON p.id = i."productId"
        WHERE p.status = 'ACTIVE'
          AND i."trackQuantity" = true
          AND i.quantity > 0
          AND i.quantity <= i."lowStockThreshold"
      `,
    ]);

    return {
      totalProducts,
      outOfStock,
      lowStock: Number(lowStock[0]?.count ?? 0),
    };
  }

  async getDashboardSummary() {
    const [revenue, orders, customers, inventory] = await Promise.all([
      this.getRevenueStats({ period: "month" }),
      this.getOrderStats({ period: "month" }),
      this.getCustomerStats({ period: "month" }),
      this.getInventorySummary(),
    ]);

    return { revenue, orders, customers, inventory };
  }
}
