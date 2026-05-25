import { Injectable, NotFoundException, ConflictException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { ReviewStatus, Prisma } from "@repo/db";

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  body?: string;
  images?: string[];
}

export interface ReviewFilterDto {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  productId?: string;
  userId?: string;
  rating?: number;
}

export interface AdminReplyDto {
  reply: string;
}

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: ReviewFilterDto = {}) {
    const { page = 1, limit = 20, status, productId, userId, rating } = filter;

    const where: Prisma.ReviewWhereInput = {
      ...(status && { status }),
      ...(productId && { productId }),
      ...(userId && { userId }),
      ...(rating !== undefined && { rating }),
    };

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          product: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findByProduct(productId: string, page = 1, limit = 10) {
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, status: "APPROVED" },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      }),
      this.prisma.review.count({ where: { productId, status: "APPROVED" } }),
    ]);

    const ratingStats = await this.prisma.review.groupBy({
      by: ["rating"],
      where: { productId, status: "APPROVED" },
      _count: { rating: true },
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      ratingStats,
    };
  }

  async findById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!review) throw new NotFoundException(`Review ${id} not found`);
    return review;
  }

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException("Product not found");

    const existing = await this.prisma.review.findFirst({
      where: { productId: dto.productId, userId },
    });
    if (existing) throw new ConflictException("You have already reviewed this product");

    const hasPurchased = await this.prisma.orderItem.findFirst({
      where: {
        productId: dto.productId,
        order: { userId, status: "DELIVERED" },
      },
    });

    return this.prisma.review.create({
      data: {
        ...dto,
        userId,
        isVerified: !!hasPurchased,
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.findById(id);
    if (review.userId !== userId) throw new ForbiddenException("You cannot edit this review");

    return this.prisma.review.update({
      where: { id },
      data: { ...dto, status: "PENDING" },
    });
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const review = await this.findById(id);
    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException("You cannot delete this review");
    }
    return this.prisma.review.delete({ where: { id } });
  }

  async approve(id: string) {
    await this.findById(id);
    const updated = await this.prisma.review.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    await this.updateProductRating(updated.productId);
    return updated;
  }

  async reject(id: string) {
    await this.findById(id);
    const updated = await this.prisma.review.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    await this.updateProductRating(updated.productId);
    return updated;
  }

  async addReply(id: string, dto: AdminReplyDto) {
    await this.findById(id);
    return this.prisma.review.update({
      where: { id },
      data: { reply: dto.reply, repliedAt: new Date() },
    });
  }

  async markHelpful(id: string, helpful: boolean) {
    await this.findById(id);
    return this.prisma.review.update({
      where: { id },
      data: helpful ? { helpful: { increment: 1 } } : { notHelpful: { increment: 1 } },
    });
  }

  private async updateProductRating(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId, status: "APPROVED" },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: new Prisma.Decimal(stats._avg.rating ?? 0),
        reviewCount: stats._count.rating,
      },
    });
  }
}
