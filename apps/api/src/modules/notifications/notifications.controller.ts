import { Controller, Get, Post, Delete, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";

interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("notifications")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: "notifications", version: "1" })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @CurrentUser() user: AuthenticatedUser,
    @Query("page") page = 1,
    @Query("limit") limit = 20,
    @Query("unreadOnly") unreadOnly = false
  ) {
    return this.notificationsService.getNotifications(
      user.id,
      Number(page),
      Number(limit),
      Boolean(unreadOnly)
    );
  }

  @Get("unread-count")
  getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Post(":id/read")
  markAsRead(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Post("read-all")
  markAllAsRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(":id")
  deleteNotification(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.deleteNotification(id, user.id);
  }

  @Delete("read/all")
  deleteAllRead(@CurrentUser() user: AuthenticatedUser) {
    return this.notificationsService.deleteAllRead(user.id);
  }
}
