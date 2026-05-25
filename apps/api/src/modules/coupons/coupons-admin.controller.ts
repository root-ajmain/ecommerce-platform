import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CouponsService, CreateCouponDto, UpdateCouponDto, CouponFilterDto } from "./coupons.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("admin/coupons")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/coupons", version: "1" })
export class CouponsAdminController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll(@Query() filter: CouponFilterDto) {
    return this.couponsService.findAll(filter);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.couponsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.couponsService.remove(id);
  }
}
