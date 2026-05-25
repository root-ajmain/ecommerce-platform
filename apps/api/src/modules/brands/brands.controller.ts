import { Controller, Get, Param, Query, SetMetadata } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BrandsService, BrandFilterDto } from "./brands.service";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("brands")
@Controller({ path: "brands", version: "1" })
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  findAll(@Query() filter: BrandFilterDto) {
    return this.brandsService.findAll({ ...filter, isActive: true });
  }

  @Public()
  @Get("featured")
  getFeatured() {
    return this.brandsService.getFeatured();
  }

  @Public()
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.brandsService.findBySlug(slug);
  }
}
