import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}
}
