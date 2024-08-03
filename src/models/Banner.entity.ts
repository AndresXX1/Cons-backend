import { Column, Entity } from 'typeorm';
import { BaseEntity } from './Base.entity';

export enum BannerType {
  ARGEN_COMPRAS = 'argencompras',
  HOME = 'home',
  CUPONIZATE = 'cuponizate',
}

@Entity({ name: 'Banners' })
export class Banner extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @Column({ type: 'enum', enum: BannerType, default: BannerType.HOME })
  type: BannerType;
}
