import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { ProductFilterDto } from "./dto/product-filter.dto";
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("products")
@Controller({ path: "products", version: "1" })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  findAll(@Query() filter: ProductFilterDto) {
    return this.productsService.findAll(filter);
  }

  @Public()
  @Get("featured")
  getFeatured() {
    return this.productsService.getFeatured();
  }

  @Public()
  @Get("bestsellers")
  getBestsellers() {
    return this.productsService.getBestsellers();
  }

  @Public()
  @Get(":slug")
  findBySlug(@Param("slug") slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(":id/related")
  findRelated(@Param("id") id: string) {
    return this.productsService.findRelated(id);
  }
}
