import {
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
import { BannerService } from './banner.service';
import * as uuid from 'uuid';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BannerType } from '@models/Banner.entity';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('banner')
@ApiTags('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @ApiOperation({ summary: 'Obtiene lista de banners de home' })
  @Get('home')
  async getAllBannersHome() {
    const result = await this.bannerService.getAllBannersForType(BannerType.HOME);
    return { ok: true, banners: result };
  }

  @ApiOperation({ summary: 'Obtiene lista de banners de cuponizate' })
  @Get('cuponizate')
  async getAllBannersHomeCuponizate() {
    const result = await this.bannerService.getAllBannersForType(BannerType.CUPONIZATE);
    return { ok: true, banners: result };
  }

  @ApiOperation({ summary: 'Obtiene lista de banners de argencompras' })
  @Get('argencompras')
  async getAllBannersHomeArgenCompras() {
    const result = await this.bannerService.getAllBannersForType(BannerType.ARGEN_COMPRAS);
    return { ok: true, banners: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Post(':type')
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
    @Param('type') type: string,
  ) {
    if (!file) throw new HttpException('a file is required', HttpStatus.BAD_REQUEST);
    const bannerName = file.filename;
    const bannerSaved = await this.bannerService.create(bannerName, type as BannerType);

    return { ok: true, banner: bannerSaved };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Delete(':id')
  async deleteBanner(@Param('id') id: string) {
    const bannerId = parseInt(`${id}`, 10);
    const bannerDeleted = await this.bannerService.deleteBanner(bannerId);
    return { ok: true, banner: bannerDeleted };
  }
}
