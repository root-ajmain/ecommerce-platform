import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { Prisma } from "@repo/db";

export interface CreateBrandDto {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDesc?: string;
}

export type UpdateBrandDto = Partial<CreateBrandDto>;

export interface BrandFilterDto {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: BrandFilterDto = {}) {
    const { page = 1, limit = 20, search, isActive, isFeatured } = filter;

    const where: Prisma.BrandWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.brand.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } },
      }),
      this.prisma.brand.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) throw new NotFoundException(`Brand '${slug}' not found`);
    return brand;
  }

  async findById(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) throw new NotFoundException(`Brand ${id} not found`);
    return brand;
  }

  async create(dto: CreateBrandDto) {
    const existing = await this.prisma.brand.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    return this.prisma.brand.create({ data: dto });
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findById(id);

    if (dto.slug) {
      const existing = await this.prisma.brand.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    }

    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.brand.delete({ where: { id } });
  }

  async getFeatured() {
    return this.prisma.brand.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { name: "asc" },
    });
  }
}
