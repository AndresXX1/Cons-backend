import { Entity, Column } from 'typeorm';

import { BaseEntity } from './Base.entity';

@Entity({ name: 'Notifications' })
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  scheduledAt: Date;

  @Column({ default: true })
  saveInHistory: boolean;

  @Column({ default: true })
  isPush: boolean;

  @Column({ nullable: false })
  redirect: string;

  @Column({ nullable: true })
  image?: string;
}
