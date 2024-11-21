import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  value: number;

  @Column()
  category: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({ default: false })
  includesShipping: boolean;

  @Column({ default: false })
  deleted: boolean;
}
