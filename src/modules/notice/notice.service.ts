import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DeviceDetector from 'device-detector-js';
import { Notice } from '@models/Notice.entity';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Injectable()
export class NoticeService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(NoticeService.name);

  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async getNotices(): Promise<Notice[]> {
    const notices = await this.noticeRepository.find({});
    const NoticesNotDeleted = notices.filter((notice) => !notice.deleted);
    return NoticesNotDeleted;
  }

  async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const notice = new Notice();
    notice.url = createNoticeDto.url;
    notice.title = createNoticeDto.title;
    notice.description = createNoticeDto.description;
    notice.date = createNoticeDto.date;
    notice.deleted = false;

    await this.noticeRepository.save(notice);
    return notice;
  }

  async deletebyId(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOne({
      where: { id },
    });
    if (!notice) {
      throw new Error('Notice not found');
    }
    notice.deleted = true;
    await this.noticeRepository.save(notice);
    return notice;
  }
}
