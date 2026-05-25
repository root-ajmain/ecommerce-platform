import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BrandsService, CreateBrandDto, UpdateBrandDto, BrandFilterDto } from "./brands.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("admin/brands")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/brands", version: "1" })
export class BrandsAdminController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll(@Query() filter: BrandFilterDto) {
    return this.brandsService.findAll(filter);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.brandsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.brandsService.remove(id);
  }
}
