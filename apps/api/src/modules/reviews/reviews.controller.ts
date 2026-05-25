import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, SetMetadata } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ReviewsService, CreateReviewDto, UpdateReviewDto } from "./reviews.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

export const Public = () => SetMetadata("isPublic", true);

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "reviews", version: "1" })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get("product/:productId")
  findByProduct(
    @Param("productId") productId: string,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    return this.reviewsService.findByProduct(productId, Number(page), Number(limit));
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.create(user.id, dto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateReviewDto
  ) {
    return this.reviewsService.update(id, user.id, dto);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.reviewsService.remove(id, user.id, false);
  }

  @Post(":id/helpful")
  markHelpful(@Param("id") id: string) {
    return this.reviewsService.markHelpful(id, true);
  }

  @Post(":id/not-helpful")
  markNotHelpful(@Param("id") id: string) {
    return this.reviewsService.markHelpful(id, false);
  }
}
