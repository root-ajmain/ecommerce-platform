import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { Prisma } from "@repo/db";

export interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDesc?: string;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(onlyActive = true) {
    const where: Prisma.CategoryWhereInput = onlyActive ? { isActive: true } : {};
    return this.prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        children: {
          where: onlyActive ? { isActive: true } : {},
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            children: {
              where: onlyActive ? { isActive: true } : {},
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
          },
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findRoots(onlyActive = true) {
    const where: Prisma.CategoryWhereInput = {
      parentId: null,
      ...(onlyActive && { isActive: true }),
    };
    return this.prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        children: {
          where: onlyActive ? { isActive: true } : {},
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: {
            children: {
              where: onlyActive ? { isActive: true } : {},
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
          },
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new NotFoundException(`Category '${slug}' not found`);
    return category;
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: { select: { products: true } },
      },
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);

    if (dto.parentId) {
      await this.findById(dto.parentId);
    }

    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);

    if (dto.slug) {
      const existing = await this.prisma.category.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    }

    if (dto.parentId) {
      await this.findById(dto.parentId);
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.category.delete({ where: { id } });
  }

  async getFeatured() {
    return this.prisma.category.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }
}
