import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import {
  CmsService,
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateHeroSlideDto,
  UpdateHeroSlideDto,
  CreateHomepageSectionDto,
  UpdateHomepageSectionDto,
  CreateBannerDto,
  UpdateBannerDto,
} from "./cms.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("admin/cms")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/cms", version: "1" })
export class CmsAdminController {
  constructor(private readonly cmsService: CmsService) {}

  // Pages
  @Get("pages")
  findAllPages() {
    return this.cmsService.findAllPages(false);
  }

  @Get("pages/:id")
  findPageById(@Param("id") id: string) {
    return this.cmsService.findPageById(id);
  }

  @Post("pages")
  createPage(@Body() dto: CreateCmsPageDto, @CurrentUser() user: AuthenticatedUser) {
    return this.cmsService.createPage(dto, user.id);
  }

  @Put("pages/:id")
  updatePage(@Param("id") id: string, @Body() dto: UpdateCmsPageDto) {
    return this.cmsService.updatePage(id, dto);
  }

  @Delete("pages/:id")
  removePage(@Param("id") id: string) {
    return this.cmsService.removePage(id);
  }

  // Hero Slides
  @Get("hero-slides")
  findAllHeroSlides() {
    return this.cmsService.findAllHeroSlides(false);
  }

  @Get("hero-slides/:id")
  findHeroSlideById(@Param("id") id: string) {
    return this.cmsService.findHeroSlideById(id);
  }

  @Post("hero-slides")
  createHeroSlide(@Body() dto: CreateHeroSlideDto) {
    return this.cmsService.createHeroSlide(dto);
  }

  @Put("hero-slides/:id")
  updateHeroSlide(@Param("id") id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.cmsService.updateHeroSlide(id, dto);
  }

  @Delete("hero-slides/:id")
  removeHeroSlide(@Param("id") id: string) {
    return this.cmsService.removeHeroSlide(id);
  }

  // Homepage Sections
  @Get("sections")
  findAllSections() {
    return this.cmsService.findAllSections(false);
  }

  @Get("sections/:id")
  findSectionById(@Param("id") id: string) {
    return this.cmsService.findSectionById(id);
  }

  @Post("sections")
  createSection(@Body() dto: CreateHomepageSectionDto) {
    return this.cmsService.createSection(dto);
  }

  @Put("sections/:id")
  updateSection(@Param("id") id: string, @Body() dto: UpdateHomepageSectionDto) {
    return this.cmsService.updateSection(id, dto);
  }

  @Delete("sections/:id")
  removeSection(@Param("id") id: string) {
    return this.cmsService.removeSection(id);
  }

  // Banners
  @Get("banners")
  findAllBanners(@Query("placement") placement?: string) {
    return this.cmsService.findAllBanners(placement, false);
  }

  @Get("banners/:id")
  findBannerById(@Param("id") id: string) {
    return this.cmsService.findBannerById(id);
  }

  @Post("banners")
  createBanner(@Body() dto: CreateBannerDto) {
    return this.cmsService.createBanner(dto);
  }

  @Put("banners/:id")
  updateBanner(@Param("id") id: string, @Body() dto: UpdateBannerDto) {
    return this.cmsService.updateBanner(id, dto);
  }

  @Delete("banners/:id")
  removeBanner(@Param("id") id: string) {
    return this.cmsService.removeBanner(id);
  }
}
