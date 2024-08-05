import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  SetMetadata,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('notice')
@ApiTags('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({ summary: 'Obtiene lista de noticias' })
  @Get('')
  async getNotices() {
    const result = await this.noticeService.getNotices();
    return { ok: true, notices: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Post('/image')
  @ApiOperation({ summary: 'subir imagen de noticia, solo admin' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new UnsupportedMediaTypeException(), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/notice/',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuid.v4();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) throw new HttpException('a file is required', HttpStatus.BAD_REQUEST);
    const bannerName = file.filename;
    return { ok: true, notice_url: bannerName };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({
    summary: 'Crear noticia, solo admin',
  })
  @Post('')
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    const notice = await this.noticeService.create(createNoticeDto);
    return { ok: true, notice };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    const noticeId = parseInt(`${id}`, 10);
    const noticeDeleted = await this.noticeService.deletebyId(noticeId);
    return { ok: true, notice: noticeDeleted };
  }
}
