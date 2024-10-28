import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from '@models/Notification.entity';
import { User } from '@models/User.entity';
import { AdminModule } from '@modules/admin/admin.module';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), forwardRef(() => AdminModule)],
  providers: [NotificationService, JwtService, ConfigService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
