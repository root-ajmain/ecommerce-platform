import { Controller, Get, Query, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { SetMetadata } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("search")
@Controller({ path: "search", version: "1" })
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  search(
    @Query("q") query: string,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("filter") filter?: string,
    @Query("sort") sort?: string
  ) {
    return this.searchService.search(query ?? "", {
      page,
      limit,
      filters: filter,
      sort: sort ? sort.split(",") : undefined,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN", "SUPER_ADMIN")
  @Post("reindex")
  reindexAll() {
    return this.searchService.reindexAll();
  }
}
