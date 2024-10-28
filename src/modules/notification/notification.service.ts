import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Notification } from '@models/Notification.entity';
import * as moment from 'moment';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@models/User.entity';
import axios from 'axios';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Tarea programada para revisar y enviar notificaciones
  @Cron(CronExpression.EVERY_MINUTE)
  async checkNotifications() {
    const now = moment().startOf('minute').toDate(); // Obtén la fecha actual con precisión de minutos

    const notifications = await this.notificationRepository.find({
      where: { scheduledAt: now },
    });

    notifications.forEach((notification) => {
      this.sendPushNotification(notification);
    });
  }

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create(createNotificationDto);
    return await this.notificationRepository.save(notification);
  }

  async sendPushNotification(notification: Notification) {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.notification_token IS NOT NULL')
      .andWhere('user.notification_token != :empty', { empty: '' })
      .getMany();

    users.forEach(async (user) => {
      try {
        const response = await axios.post(
          'https://exp.host/--/api/v2/push/send',
          {
            to: user.notification_token,
            title: notification.title,
            sound: 'default',
            data: { action: 'reload' },
          },
          {
            headers: {
              Accept: 'application/json',
              'Accept-encoding': 'gzip, deflate',
              'Content-Type': 'application/json',
            },
          },
        );

        console.log(`Notification sent to user ${user.id}:`, response.data);
      } catch (error) {
        console.error(`Failed to send notification to user ${user.id}:`, error);
      }
    });
  }
}
