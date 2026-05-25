import { Controller, Get, Param, Query, SetMetadata } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CmsService } from "./cms.service";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("cms")
@Controller({ path: "cms", version: "1" })
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get("pages")
  findAllPages() {
    return this.cmsService.findAllPages(true);
  }

  @Public()
  @Get("pages/:slug")
  findPageBySlug(@Param("slug") slug: string) {
    return this.cmsService.findPageBySlug(slug);
  }

  @Public()
  @Get("hero-slides")
  findAllHeroSlides() {
    return this.cmsService.findAllHeroSlides(true);
  }

  @Public()
  @Get("sections")
  findAllSections() {
    return this.cmsService.findAllSections(true);
  }

  @Public()
  @Get("banners")
  findAllBanners(@Query("placement") placement?: string) {
    return this.cmsService.findAllBanners(placement, true);
  }
}
