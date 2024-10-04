import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { User } from './User.entity';

export enum ViewType {
  HOME = 'home',
  PROFILE = 'profile',
  ARGENCOMPRAS = 'argencompras',
  CUPONIZATE = 'cuponizate',
}

@Entity({ name: 'Timmers' })
export class Timmer extends BaseEntity {
  @Column({ type: 'enum', enum: ViewType, default: ViewType.HOME })
  view: ViewType;

  @Column({ type: 'int', nullable: false })
  time: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}
