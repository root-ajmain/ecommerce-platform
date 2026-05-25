import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewsService, ReviewFilterDto, AdminReplyDto } from "./reviews.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("admin/reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/reviews", version: "1" })
export class ReviewsAdminController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query() filter: ReviewFilterDto) {
    return this.reviewsService.findAll(filter);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reviewsService.findById(id);
  }

  @Post(":id/approve")
  approve(@Param("id") id: string) {
    return this.reviewsService.approve(id);
  }

  @Post(":id/reject")
  reject(@Param("id") id: string) {
    return this.reviewsService.reject(id);
  }

  @Post(":id/reply")
  addReply(@Param("id") id: string, @Body() dto: AdminReplyDto) {
    return this.reviewsService.addReply(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.reviewsService.remove(id, user.id, true);
  }
}
