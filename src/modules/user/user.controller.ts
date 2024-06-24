import { Body, Controller, Get, Put, UploadedFile, UseInterceptors, UseGuards, HttpException, HttpStatus, UnsupportedMediaTypeException, Post, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { UserService } from './user.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { Roles } from '@infrastructure/decorators/role-protected.decorator';
import { User } from '@models/User.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { EditProfileDto } from './dto/edit-profile.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene tu datos de usuario' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() user: User) {
    return { ok: true, user };
  }

  @UseGuards(JwtAuthRolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Obtiene lista de usuarios, solo admin role' })
  @Get('all')
  async getUsers() {
    const result = await this.userService.getUsers();
    return { ok: true, users: result };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: EditProfileDto })
  @ApiOperation({ summary: 'Edita tu datos de usuario' })
  @Put('')
  async editProfile(@GetUser() user: User, @Body() editProfileDto: EditProfileDto) {
    const userId = parseInt(`${user.id}`, 10);
    const usersaved = await this.userService.editProfile(userId, editProfileDto);

    return { ok: true, user: usersaved };
  }

  @UseGuards(JwtAuthGuard)
  @Put('avatar')
  @ApiOperation({ summary: 'Edita tu avatar de usuario' })
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
    @GetUser() user: User,
  ) {
    if (!file) throw new HttpException('a file is required', HttpStatus.BAD_REQUEST);

    const userId = parseInt(`${user.id}`, 10);
    const avatar = file.filename;
    const usersaved = await this.userService.changeAvatar(userId, avatar);

    return { ok: true, user: usersaved };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Verifica que el codigo ingresado por el usuario coincida con el mandado al email',
  })
  @Post('verify-code')
  async verifyCode(@GetUser() user: User, @Body() dto: VerifyCodeDto) {
    const userId = parseInt(`${user.id}`, 10);
    const serviceResponse = await this.userService.verifyEmailCode(dto.code, userId);

    return serviceResponse;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId2/search')
  @ApiOperation({ summary: 'Busqueda de usuario por id' })
  async searchUserById(@Param('userId2') userId2: number) {
    return this.userService.findById(Number(userId2));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CompleteProfileDto })
  @ApiOperation({ summary: 'Completa tu perfil de usuario' })
  @Put('complete-profile')
  async completeProfile(@GetUser() user: User, @Body() completeProfileDto: CompleteProfileDto) {
    const userId = parseInt(`${user.id}`, 10);
    await this.userService.completeProfile(userId, completeProfileDto);

    return { ok: true, message: 'Profile completed' };
  }
}
