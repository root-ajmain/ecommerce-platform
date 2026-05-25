import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CmsPageStatus, Prisma } from "@repo/db";

export interface CreateCmsPageDto {
  title: string;
  slug: string;
  content?: Prisma.InputJsonValue;
  status?: CmsPageStatus;
  publishedAt?: string;
  scheduledAt?: string;
  metaTitle?: string;
  metaDesc?: string;
  metaKeywords?: string;
  template?: string;
}

export type UpdateCmsPageDto = Partial<CreateCmsPageDto>;

export interface CreateHeroSlideDto {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export type UpdateHeroSlideDto = Partial<CreateHeroSlideDto>;

export interface CreateHomepageSectionDto {
  type: string;
  title?: string;
  config: Prisma.InputJsonValue;
  isActive?: boolean;
  sortOrder?: number;
  startDate?: string;
  endDate?: string;
}

export type UpdateHomepageSectionDto = Partial<CreateHomepageSectionDto>;

export interface CreateBannerDto {
  title?: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

export type UpdateBannerDto = Partial<CreateBannerDto>;

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // CMS Pages
  async findAllPages(onlyPublished = false) {
    return this.prisma.cmsPage.findMany({
      where: onlyPublished ? { status: "PUBLISHED" } : {},
      orderBy: { updatedAt: "desc" },
    });
  }

  async findPageBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { slug } });
    if (!page) throw new NotFoundException(`Page '${slug}' not found`);
    return page;
  }

  async findPageById(id: string) {
    const page = await this.prisma.cmsPage.findUnique({ where: { id } });
    if (!page) throw new NotFoundException(`Page ${id} not found`);
    return page;
  }

  async createPage(dto: CreateCmsPageDto, createdById?: string) {
    const existing = await this.prisma.cmsPage.findUnique({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);

    return this.prisma.cmsPage.create({
      data: {
        ...dto,
        createdById,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
    });
  }

  async updatePage(id: string, dto: UpdateCmsPageDto) {
    await this.findPageById(id);

    if (dto.slug) {
      const existing = await this.prisma.cmsPage.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    }

    return this.prisma.cmsPage.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.publishedAt && { publishedAt: new Date(dto.publishedAt) }),
        ...(dto.scheduledAt && { scheduledAt: new Date(dto.scheduledAt) }),
      },
    });
  }

  async removePage(id: string) {
    await this.findPageById(id);
    return this.prisma.cmsPage.delete({ where: { id } });
  }

  // Hero Slides
  async findAllHeroSlides(onlyActive = false) {
    return this.prisma.heroSlide.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { sortOrder: "asc" },
    });
  }

  async findHeroSlideById(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException(`Hero slide ${id} not found`);
    return slide;
  }

  async createHeroSlide(dto: CreateHeroSlideDto) {
    return this.prisma.heroSlide.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateHeroSlide(id: string, dto: UpdateHeroSlideDto) {
    await this.findHeroSlideById(id);
    return this.prisma.heroSlide.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async removeHeroSlide(id: string) {
    await this.findHeroSlideById(id);
    return this.prisma.heroSlide.delete({ where: { id } });
  }

  // Homepage Sections
  async findAllSections(onlyActive = false) {
    return this.prisma.homepageSection.findMany({
      where: onlyActive ? { isActive: true } : {},
      orderBy: { sortOrder: "asc" },
    });
  }

  async findSectionById(id: string) {
    const section = await this.prisma.homepageSection.findUnique({ where: { id } });
    if (!section) throw new NotFoundException(`Section ${id} not found`);
    return section;
  }

  async createSection(dto: CreateHomepageSectionDto) {
    return this.prisma.homepageSection.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateSection(id: string, dto: UpdateHomepageSectionDto) {
    await this.findSectionById(id);
    return this.prisma.homepageSection.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async removeSection(id: string) {
    await this.findSectionById(id);
    return this.prisma.homepageSection.delete({ where: { id } });
  }

  // Banners
  async findAllBanners(placement?: string, onlyActive = false) {
    return this.prisma.banner.findMany({
      where: {
        ...(onlyActive && { isActive: true }),
        ...(placement && { placement }),
      },
      orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
    });
  }

  async findBannerById(id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) throw new NotFoundException(`Banner ${id} not found`);
    return banner;
  }

  async createBanner(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    await this.findBannerById(id);
    return this.prisma.banner.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.endDate && { endDate: new Date(dto.endDate) }),
      },
    });
  }

  async removeBanner(id: string) {
    await this.findBannerById(id);
    return this.prisma.banner.delete({ where: { id } });
  }
}
