import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { BaseEntity } from './Base.entity';

@Entity()
export class Notification {
  
  @PrimaryGeneratedColumn('increment')
  id: number;

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
