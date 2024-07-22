import { Index, OneToMany } from 'typeorm';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { SessionAdmin } from './SessionAdmin.entity';

@Entity({ name: 'Admins' })
export class Admin extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255 })
  email_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login?: Date;

  // -------- Relations ---------
  @OneToMany(() => SessionAdmin, (sessionAdmin) => sessionAdmin.admin)
  sessionAdmins: SessionAdmin[];
}
