import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductFilterDto } from "./dto/product-filter.dto";
import { Prisma } from "@repo/db";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: ProductFilterDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      rating,
      inStock,
      search,
      tags,
      status = "ACTIVE",
      type,
    } = filter;

    const where: Prisma.ProductWhereInput = {
      status,
      ...(type && { type }),
      ...(brandId && { brandId }),
      ...(categoryId && {
        categories: { some: { categoryId } },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? { price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) } }
        : {}),
      ...(rating && { rating: { gte: rating } }),
      ...(inStock === true && {
        OR: [
          { inventory: { quantity: { gt: 0 } } },
          { inventory: null },
        ],
      }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(tags?.length && {
        tags: { some: { tag: { slug: { in: tags } } } },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          brand: { select: { id: true, name: true, slug: true } },
          categories: {
            include: { category: { select: { id: true, name: true, slug: true } } },
          },
          inventory: { select: { quantity: true, reservedQuantity: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        brand: true,
        categories: { include: { category: true } },
        variants: {
          where: { isActive: true },
          include: {
            attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
            inventory: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        attributes: { include: { attribute: true, attributeValue: true } },
        tags: { include: { tag: true } },
        inventory: true,
        reviews: {
          where: { status: "APPROVED" },
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        },
      },
    });

    if (!product) throw new NotFoundException(`Product '${slug}' not found`);

    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);

    const { categoryIds, tagIds, images, variants, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        ...(categoryIds?.length && {
          categories: { create: categoryIds.map((id) => ({ categoryId: id })) },
        }),
        ...(tagIds?.length && {
          tags: { create: tagIds.map((id) => ({ tagId: id })) },
        }),
        ...(images?.length && {
          images: { create: images },
        }),
        inventory: {
          create: { quantity: 0, lowStockThreshold: 5 },
        },
      },
      include: { images: true, categories: true, inventory: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);
    const { categoryIds, tagIds, images, variants, ...productData } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryIds && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((cid) => ({ categoryId: cid })),
          },
        }),
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tid) => ({ tagId: tid })),
          },
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async findRelated(productId: string, limit = 8) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { categories: true },
    });
    if (!product) return [];

    const categoryIds = product.categories.map((c) => c.categoryId);

    return this.prisma.product.findMany({
      where: {
        id: { not: productId },
        status: "ACTIVE",
        categories: { some: { categoryId: { in: categoryIds } } },
      },
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });
  }

  async getFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 }, inventory: true },
      orderBy: { salesCount: "desc" },
    });
  }

  async getBestsellers(limit = 8) {
    return this.prisma.product.findMany({
      where: { status: "ACTIVE", isBestseller: true },
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 }, inventory: true },
      orderBy: { salesCount: "desc" },
    });
  }
}
