import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'Branches' })
export class Branch extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  schedules_1: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  schedules_2: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  whatsapp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'text', default: null, nullable: true })
  url: string;
}
