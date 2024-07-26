import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DeviceDetector from 'device-detector-js';
import { Banner } from '@models/Banner.entity';

@Injectable()
export class BannerService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(BannerService.name);

  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async getBanners(): Promise<Banner[]> {
    const banners = await this.bannerRepository.find({});
    const bannerNotDeleted = banners.filter((banner) => !banner.deleted);
    return bannerNotDeleted;
  }

  async create(bannerName: string): Promise<Banner> {
    const banner = new Banner();
    banner.url = bannerName;
    banner.deleted = false;

    await this.bannerRepository.save(banner);
    return banner;
  }

  async deleteBanner(id: number): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });
    if (!banner) {
      throw new Error('Banner not found');
    }
    banner.deleted = true;
    await this.bannerRepository.save(banner);
    return banner;
  }
}
