import { Index, OneToMany } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Session } from './Session.entity';

export enum UserRoleType {
  ADMIN = 'admin',
  INTERNAL = 'internal',
  USER = 'user',
  OWNER = 'owner',
}

export enum Genre {
  MALE = 'Hombre',
  FEMALE = 'Mujer',
}

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'boolean', default: false })
  completed_profile: boolean;

  @Column({ type: 'boolean', default: false })
  completed_welcome_form: boolean;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  lat: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  len: string;

  @Column({ type: 'varchar', length: 255, default: 'default-user-avatar.png', nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, default: '', select: false })
  email_code: string;

  @Column({ nullable: true, select: false })
  email_code_create_at: Date;

  @Column({ type: 'enum', enum: UserRoleType, default: UserRoleType.USER })
  role: UserRoleType;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  // sección editar usuario START
  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 255, default: '', nullable: true })
  last_name: string;

  @Column({ type: 'int', default: 0, nullable: true })
  points: number;

  @Column({ type: 'varchar', default: '' })
  phone: string;

  @Column({ type: 'enum', enum: Genre, default: Genre.MALE })
  genre: Genre;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'varchar', nullable: true })
  federate: string;

  // -------- Relations ---------
  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}
