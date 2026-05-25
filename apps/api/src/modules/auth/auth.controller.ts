import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata("isPublic", true);

@ApiTags("auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: { headers: { authorization?: string } }) {
    const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
    return this.authService.revokeToken(token);
  }
}
