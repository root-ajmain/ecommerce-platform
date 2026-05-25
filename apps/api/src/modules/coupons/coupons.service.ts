import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CouponType, Prisma } from "@repo/db";

export interface CreateCouponDto {
  code: string;
  name: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  isActive?: boolean;
  startsAt?: string;
  expiresAt?: string;
  applicableToAll?: boolean;
}

export type UpdateCouponDto = Partial<CreateCouponDto>;

export interface ValidateCouponDto {
  code: string;
  orderAmount: number;
  userId?: string;
}

export interface CouponFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  type?: CouponType;
}

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: CouponFilterDto = {}) {
    const { page = 1, limit = 20, search, isActive, type } = filter;

    const where: Prisma.CouponWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(type && { type }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: "insensitive" } },
          { name: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { usageHistory: true } } },
      }),
      this.prisma.coupon.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: { _count: { select: { usageHistory: true } } },
    });
    if (!coupon) throw new NotFoundException(`Coupon ${id} not found`);
    return coupon;
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon) throw new NotFoundException(`Coupon '${code}' not found`);
    return coupon;
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.toUpperCase();
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (existing) throw new ConflictException(`Coupon code '${code}' already exists`);

    return this.prisma.coupon.create({
      data: {
        ...dto,
        code,
        value: new Prisma.Decimal(dto.value),
        minOrderAmount: dto.minOrderAmount != null ? new Prisma.Decimal(dto.minOrderAmount) : undefined,
        maxDiscountAmount: dto.maxDiscountAmount != null ? new Prisma.Decimal(dto.maxDiscountAmount) : undefined,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    await this.findById(id);

    if (dto.code) {
      const code = dto.code.toUpperCase();
      const existing = await this.prisma.coupon.findFirst({
        where: { code, id: { not: id } },
      });
      if (existing) throw new ConflictException(`Coupon code '${code}' already exists`);
      dto.code = code;
    }

    return this.prisma.coupon.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.value !== undefined && { value: new Prisma.Decimal(dto.value) }),
        ...(dto.minOrderAmount !== undefined && {
          minOrderAmount: dto.minOrderAmount != null ? new Prisma.Decimal(dto.minOrderAmount) : null,
        }),
        ...(dto.maxDiscountAmount !== undefined && {
          maxDiscountAmount: dto.maxDiscountAmount != null ? new Prisma.Decimal(dto.maxDiscountAmount) : null,
        }),
        ...(dto.startsAt && { startsAt: new Date(dto.startsAt) }),
        ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }),
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  async validate(dto: ValidateCouponDto) {
    const code = dto.code.toUpperCase();
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon) throw new NotFoundException("Invalid coupon code");
    if (!coupon.isActive) throw new BadRequestException("Coupon is not active");

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new BadRequestException("Coupon is not yet valid");
    }
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException("Coupon has expired");
    }

    if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException("Coupon usage limit reached");
    }

    if (
      coupon.minOrderAmount != null &&
      dto.orderAmount < Number(coupon.minOrderAmount)
    ) {
      throw new BadRequestException(
        `Minimum order amount of ${coupon.minOrderAmount} required`
      );
    }

    if (dto.userId && coupon.perUserLimit != null) {
      const userUsageCount = await this.prisma.couponUsage.count({
        where: { couponId: coupon.id, userId: dto.userId },
      });
      if (userUsageCount >= coupon.perUserLimit) {
        throw new BadRequestException("You have reached the usage limit for this coupon");
      }
    }

    let discountAmount: number;
    if (coupon.type === "PERCENTAGE") {
      discountAmount = (dto.orderAmount * Number(coupon.value)) / 100;
      if (coupon.maxDiscountAmount != null) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else if (coupon.type === "FIXED_AMOUNT") {
      discountAmount = Math.min(Number(coupon.value), dto.orderAmount);
    } else if (coupon.type === "FREE_SHIPPING") {
      discountAmount = 0;
    } else {
      discountAmount = 0;
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      finalAmount: dto.orderAmount - discountAmount,
    };
  }
}
