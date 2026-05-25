import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../common/prisma/prisma.service";
import { AuthTokens, JwtPayload } from "@repo/types";
import * as bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get("jwt.secret"),
        expiresIn: this.config.get("jwt.expiresIn"),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get("jwt.refreshSecret"),
        expiresIn: this.config.get("jwt.refreshExpiresIn"),
      }),
    ]);

    await this.prisma.userSession.create({
      data: {
        userId,
        token: accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken, expiresIn: 900 };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get("jwt.refreshSecret"),
      });

      const session = await this.prisma.userSession.findUnique({
        where: { refreshToken },
        include: { user: true },
      });

      if (!session || session.expiresAt < new Date()) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      await this.prisma.userSession.delete({ where: { refreshToken } });

      return this.generateTokens(payload.sub, payload.email, payload.role);
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async revokeToken(token: string): Promise<void> {
    await this.prisma.userSession.deleteMany({ where: { token } });
  }

  async syncClerkUser(clerkId: string, data: {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
  }) {
    return this.prisma.user.upsert({
      where: { clerkId },
      update: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        phone: data.phone,
      },
      create: {
        clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        phone: data.phone,
        referralCode: uuidv4().slice(0, 8).toUpperCase(),
      },
    });
  }

  async deleteClerkUser(clerkId: string) {
    await this.prisma.user.update({
      where: { clerkId },
      data: { status: "INACTIVE" },
    });
  }
}
