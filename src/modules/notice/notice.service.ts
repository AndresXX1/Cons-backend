import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DeviceDetector from 'device-detector-js';
import { Notice } from '@models/Notice.entity';

@Injectable()
export class NoticeService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(NoticeService.name);

  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}
}
