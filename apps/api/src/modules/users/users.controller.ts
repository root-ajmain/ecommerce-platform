import { Controller, Get, Put, Post, Delete, Param, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService, UpdateProfileDto, CreateAddressDto, UpdateAddressDto } from "./users.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "users", version: "1" })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getProfile(user.id);
  }

  @Put("me")
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Get("me/addresses")
  getAddresses(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getAddresses(user.id);
  }

  @Get("me/addresses/:addressId")
  getAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param("addressId") addressId: string
  ) {
    return this.usersService.getAddress(user.id, addressId);
  }

  @Post("me/addresses")
  createAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAddressDto
  ) {
    return this.usersService.createAddress(user.id, dto);
  }

  @Put("me/addresses/:addressId")
  updateAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param("addressId") addressId: string,
    @Body() dto: UpdateAddressDto
  ) {
    return this.usersService.updateAddress(user.id, addressId, dto);
  }

  @Delete("me/addresses/:addressId")
  removeAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param("addressId") addressId: string
  ) {
    return this.usersService.removeAddress(user.id, addressId);
  }

  @Post("me/addresses/:addressId/set-default")
  setDefaultAddress(
    @CurrentUser() user: AuthenticatedUser,
    @Param("addressId") addressId: string
  ) {
    return this.usersService.setDefaultAddress(user.id, addressId);
  }
}
