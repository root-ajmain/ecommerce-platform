import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { InventoryService, AdjustInventoryDto, AdjustVariantInventoryDto, LowStockFilterDto } from "./inventory.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("admin/inventory")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/inventory", version: "1" })
export class InventoryAdminController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("low-stock")
  getLowStock(@Query() filter: LowStockFilterDto) {
    return this.inventoryService.getLowStock(filter);
  }

  @Get("products/:productId")
  getInventory(@Param("productId") productId: string) {
    return this.inventoryService.getInventory(productId);
  }

  @Get("products/:productId/movements")
  getMovements(
    @Param("productId") productId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 20
  ) {
    return this.inventoryService.getMovements(productId, Number(page), Number(limit));
  }

  @Post("products/:productId/adjust")
  adjustInventory(
    @Param("productId") productId: string,
    @Body() dto: AdjustInventoryDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.inventoryService.adjustInventory(productId, dto, user.id);
  }

  @Post("variants/adjust")
  adjustVariantInventory(
    @Body() dto: AdjustVariantInventoryDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.inventoryService.adjustVariantInventory(dto, user.id);
  }

  @Put("products/:productId/threshold")
  updateThreshold(
    @Param("productId") productId: string,
    @Body("lowStockThreshold") lowStockThreshold: number
  ) {
    return this.inventoryService.updateThreshold(productId, lowStockThreshold);
  }
}
