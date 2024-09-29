import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'Products' })
export class Product extends BaseEntity {
  @Column({ type: 'int', nullable: false })
  api_id: number;

  @Column({ type: 'boolean', default: false })
  is_visible: boolean;
}
