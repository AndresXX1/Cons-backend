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
}
