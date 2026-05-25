import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

@ApiTags("orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "orders", version: "1" })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser("id") userId: string) {
    return this.ordersService.createOrder(dto, userId);
  }

  @Get()
  findMyOrders(
    @CurrentUser("id") userId: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    return this.ordersService.findByUser(userId, page, limit);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.ordersService.findById(id, userId);
  }

  @Patch(":id/cancel")
  cancel(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Body("reason") reason?: string
  ) {
    return this.ordersService.cancelOrder(id, userId, reason);
  }
}
