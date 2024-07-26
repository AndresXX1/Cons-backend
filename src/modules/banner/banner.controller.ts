import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BannerService } from './banner.service';
import * as uuid from 'uuid';
import { Roles } from '@infrastructure/decorators/role-protected.decorator';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @ApiOperation({ summary: 'Obtiene lista de banners' })
  @Get('')
  async getBanners() {
    const result = await this.bannerService.getBanners();
    return { ok: true, banners: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @Roles('admin')
  @Post('')
  @ApiOperation({ summary: 'Crear banner solo admin' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new UnsupportedMediaTypeException(), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/banner/',
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
    const bannerSaved = await this.bannerService.create(bannerName);

    return { ok: true, banner: bannerSaved };
  }

  @UseGuards(JwtAuthRolesGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    const bannerId = parseInt(`${id}`, 10);
    const bannerDeleted = await this.bannerService.deleteBanner(bannerId);
    return { ok: true, banner: bannerDeleted };
  }
}
