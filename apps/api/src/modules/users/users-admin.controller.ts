import { Controller, Get, Put, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService, UserFilterDto } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserStatus } from "@repo/db";

@ApiTags("admin/users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN", "SUPER_ADMIN")
@Controller({ path: "admin/users", version: "1" })
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query() filter: UserFilterDto) {
    return this.usersService.findAllUsers(filter);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findUserById(id);
  }

  @Put(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: UserStatus
  ) {
    return this.usersService.updateUserStatus(id, status);
  }

  @Put(":id/role")
  updateRole(
    @Param("id") id: string,
    @Body("role") role: string
  ) {
    return this.usersService.updateUserRole(id, role);
  }
}
