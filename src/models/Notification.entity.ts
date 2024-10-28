import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './Base.entity';

@Entity({ name: 'Notifications' })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  scheduledAt: Date;

  @Column({ default: true })
  saveInHistory: boolean;
}
