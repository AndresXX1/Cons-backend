import { Controller, Post, Body, UseGuards, SetMetadata, Get, Delete, Param, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Post('create')
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    const result = await this.notificationService.createNotification(createNotificationDto);
    return { ok: true, result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Get('')
  async getAllNotifications() {
    const result = await this.notificationService.getAllNotifications();
    return { ok: true, notifications: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Get('nextNotifications')
  async getNextNotifications() {
    const result = await this.notificationService.getNextNotifications();
    return { ok: true, notifications: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Get('oldNotifications')
  async getOldNotifications() {
    const result = await this.notificationService.getOldNotifications();
    return { ok: true, notifications: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('appNotification')
  async appNotifications(@GetUser() user: User) {
    const result = await this.notificationService.appNotifications(user);
    return { ok: true, notifications: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Delete(':id')
  async deleteNotification(@Param('id') id: number) {
    const result = await this.notificationService.deleteNotification(id);
    return { ok: true, message: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Put(':id')
  async updateNotification(@Param('id') id: number, @Body() updateNotificationDto: CreateNotificationDto) {
    const result = await this.notificationService.updateNotification(id, updateNotificationDto);
    return { ok: true, result };
  }
}
