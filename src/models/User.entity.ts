import { Index, OneToMany } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Session } from './Session.entity';
import { Timmer } from './Timmer.entity';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'boolean', default: false })
  cuponizate: boolean;

  @Column({ type: 'varchar', length: 255, default: '' })
  notification_token: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, default: 'default-user-avatar.png', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, default: '', select: false })
  email_code: string;

  @Column({ nullable: true, select: false })
  email_code_create_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  // sección editar usuario START
  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  last_name: string;

  @Column({ type: 'varchar', default: '' })
  phone: string;

  @Column({ type: 'varchar', default: '' })
  cuil: string;

  @Column({ type: 'date', nullable: true, default: null })
  birthday: Date;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', default: null, nullable: true })
  gender: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  // -------- Relations ---------
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => Timmer, (timmer) => timmer.user)
  timmers: Timmer[];
}
