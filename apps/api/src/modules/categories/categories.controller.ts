import { Controller, Get, Param, Query, SetMetadata } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("categories")
@Controller({ path: "categories", version: "1" })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findAll() {
    return this.categoriesService.findRoots(true);
  }

  @Public()
  @Get("featured")
  getFeatured() {
    return this.categoriesService.getFeatured();
  }

  @Public()
  @Get("tree")
  getTree() {
    return this.categoriesService.findAll(true);
  }

  @Public()
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
