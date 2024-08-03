import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  SetMetadata,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Public } from '@infrastructure/decorators/public-route.decorator';
import { LogInDto } from './dto/log-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { GetAdmin } from '@infrastructure/decorators/get-user.decorator';
import { META_ROLES } from '@infrastructure/constants';
import { Admin, RoleAdminType } from '@models/Admin.entity';
import * as uuid from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateAdminDto } from './dto/create-admin.dto';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'Obtiene tu datos de usuario admins' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetAdmin() admin: Admin) {
    return { ok: true, user: admin };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'Obtiene todos los admins' })
  @ApiBearerAuth()
  @Get('all')
  async getAdmins() {
    const admins = await this.adminService.getAdmins();
    return { ok: true, admins };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'elimina un admin, solo super admin' })
  @ApiBearerAuth()
  @Delete('remove/:id')
  async deleteBanner(@Param('id') id: string) {
    const adminId = parseInt(`${id}`, 10);
    const adminDeleted = await this.adminService.deleteAdmin(adminId);
    return { ok: true, admin: adminDeleted };
  }

  @Public()
  @ApiBody({ type: LogInDto })
  @ApiOperation({ summary: 'Logea el admin con email y password' })
  @Post('/log-in')
  async logIn(
    @Body() logInDto: LogInDto,
    @Req()
    request: Request,
  ) {
    const userResponse = await this.adminService.logIn(request, logInDto);
    return userResponse;
  }

  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @ApiOperation({ summary: 'Refresca el token' })
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const token = await this.adminService.refreshToken(refreshTokenDto);
    return { ok: true, token };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Post('/avatar')
  @ApiOperation({ summary: 'subir imagen de avatar, solo admin' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new UnsupportedMediaTypeException(), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/avatar/',
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
    const avatarName = file.filename;
    return { ok: true, avatar: avatarName };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'crear admin, solo super admin' })
  @Post('create')
  async createUserDemo(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.createAdminFetch(createAdminDto);
    return { ok: true, admin };
  }
}
