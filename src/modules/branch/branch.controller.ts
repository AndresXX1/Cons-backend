import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  SetMetadata,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import { CreateBranchDto } from './dto/create-branch.dto';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('branch')
@ApiTags('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiOperation({ summary: 'Obtiene lista de sucursales' })
  @Get('')
  async getBranches() {
    const branches = await this.branchService.getBranches();
    return { ok: true, branches: branches };
  }

  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene una oferta para la persona solicitada' })
  //@ApiBearerAuth()
  @Get('getCoupon/:platformId/:branchName')
  async getCoupon(@GetUser() user: User, @Param('branchName') branchName: string, @Param('platformId') platformId: number) {
    const userId = parseInt(`${user?.id}`, 10);
    const smarterData = await this.branchService.getCoupon(userId, branchName, platformId);
    return { ok: true, user, offer: smarterData };
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
        destination: './uploads/branch/',
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
    const branchName = file.filename;
    return { ok: true, url: branchName };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'Crea sucursal' })
  @Post('')
  async createBranch(@Body() createBranchDto: CreateBranchDto) {
    const result = await this.branchService.createBranch(createBranchDto);
    return { ok: true, branch: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'Actualizar sucursal' })
  @Put(':id')
  async updateBranch(@Param('id') id: number, @Body() updateBranchDto: CreateBranchDto) {
    const result = await this.branchService.UpdateBranch(id, updateBranchDto);
    return { ok: true, branch: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @ApiOperation({ summary: 'Eliminar sucursal' })
  @Delete(':id')
  async deleteBranch(@Param('id') id: number) {
    await this.branchService.deleteBranch(id);
    return { ok: true, message: `Branch with ID ${id} deleted successfully` };
  }
}
