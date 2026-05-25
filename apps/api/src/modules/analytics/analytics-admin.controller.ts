import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AnalyticsService, DateRangeDto } from "./analytics.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("admin/analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/analytics", version: "1" })
export class AnalyticsAdminController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  getDashboard() {
    return this.analyticsService.getDashboardSummary();
  }

  @Get("revenue")
  getRevenue(@Query() dto: DateRangeDto) {
    return this.analyticsService.getRevenueStats(dto);
  }

  @Get("orders")
  getOrders(@Query() dto: DateRangeDto) {
    return this.analyticsService.getOrderStats(dto);
  }

  @Get("top-products")
  getTopProducts(@Query() dto: DateRangeDto, @Query("limit") limit = 10) {
    return this.analyticsService.getTopProducts(dto, Number(limit));
  }

  @Get("recent-orders")
  getRecentOrders(@Query("limit") limit = 10) {
    return this.analyticsService.getRecentOrders(Number(limit));
  }

  @Get("customers")
  getCustomerStats(@Query() dto: DateRangeDto) {
    return this.analyticsService.getCustomerStats(dto);
  }

  @Get("inventory")
  getInventorySummary() {
    return this.analyticsService.getInventorySummary();
  }
}
