import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { Notification } from '@models/Notification.entity';
import * as moment from 'moment';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@models/User.entity';

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

    users.forEach((user) => {
      console.log(`Sending push notification to ${user.id}: ${notification.title}`);
      // Aquí se agregaría la lógica de envío real usando el tokenPush de cada usuario
    });
  }
}
