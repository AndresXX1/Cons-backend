import { Body, Controller, Get, Put, UseGuards, Post, Param, SetMetadata, Delete, UnsupportedMediaTypeException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { UpdateFirstDataDto } from './dto/first-data.dto';
import { UpdateSecondDataDto } from './dto/second-data.dto';
import { AddressDto } from './dto/address.dto';
import { updateUserDataDto } from './dto/update-user-data.dto';
import { NewImageDto } from './dto/new-image.dto';
const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene tu datos de usuario' })
  @Get('')
  async getProfile(@GetUser() user: User) {
    const userId = parseInt(`${user.id}`, 10);
    const smarterData = await this.userService.getSmarterData(userId);
    return { ok: true, user, smarter: smarterData };
  }

  @UseGuards(JwtAuthGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene el estado de credito del usuario' })
  @Get('getOffer/:platformId/:branchName')
  async getOffer(@GetUser() user: User, @Param() params: { branchName: string; platformId: number }) {
    const userId = parseInt(`${user.id}`, 10);
    const smarterData = await this.userService.getOffer(userId, params.branchName, params.platformId);
    return { ok: true, user, offer: smarterData };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene lista de usuarios, solo admin' })
  @Get('all')
  async getUsers() {
    const result = await this.userService.getUsers();
    return { ok: true, users: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Activa o desactiva un usuario, solo admin' })
  @Put('cuponizate/:userId')
  async putUserCuponizate(@Param('userId') userId: number) {
    const user = await this.userService.putUserCuponizate(userId);
    return { ok: true, user: user };
  }

  @UseGuards(JwtAuthGuard)
  @Put('avatar')
  @ApiOperation({ summary: 'Edita tu avatar de usuario' })
  async uploadFile(@GetUser() user: User, @Body() newImage: NewImageDto) {
    if (!allowedFileExtensions.includes(newImage.filename.split('.').pop() ?? '')) {
      throw new UnsupportedMediaTypeException();
    }
    const userId = parseInt(`${user.id}`, 10);
    const usersaved = await this.userService.changeAvatar(newImage, userId);

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
  @ApiOperation({
    summary: 'Recibe el nombre, apellido y cuil',
  })
  @Post('first-data')
  async updateFirstData(@GetUser() user: User, @Body() updateFirstDataDto: UpdateFirstDataDto) {
    const userId = parseInt(`${user.id}`, 10);
    const userResponse = await this.userService.updateFirstData(userId, updateFirstDataDto);

    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Recibe el fecha de nacimiento y numero de telefono',
  })
  @Post('second-data')
  async updateSecondData(@GetUser() user: User, @Body() updateSecondDataDto: UpdateSecondDataDto) {
    const userId = parseInt(`${user.id}`, 10);
    const userResponse = await this.userService.updateSecondData(userId, updateSecondDataDto);

    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Subir dirección' })
  @Post('address')
  async createAddress(@GetUser() user: User, @Body() address: AddressDto) {
    const userId = parseInt(`${user.id}`, 10);
    const userResponse = await this.userService.createAddress(userId, address);

    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Editar dirección' })
  @Put('address/:index')
  async editAddress(@GetUser() user: User, @Body() updatedAddress: AddressDto, @Param('index') index: number) {
    const userId = parseInt(`${user.id}`, 10);
    const userResponse = await this.userService.editAddress(userId, index, updatedAddress);

    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Eliminar dirección' })
  @Delete('address/:index')
  async deleteAddress(@GetUser() user: User, @Param('index') index: number) {
    const userId = parseInt(`${user.id}`, 10);
    const userResponse = await this.userService.deleteAddress(userId, index);

    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Subir dirección para un usuario específico' })
  @Post(':userId/address')  
  async createAddressAdmin(
    @Body() address: AddressDto,
    @Param('userId') userId: number, 
  ) {
    const userResponse = await this.userService.createAddressAdmin(userId, address);
    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Editar dirección de un usuario específico' })
  @Put(':userId/address/:index')  
  async editAddressAdmin(
    @Body() updatedAddress: AddressDto,
    @Param('userId') userId: number,  
    @Param('index') index: number,   
  ) {
    const userResponse = await this.userService.editAddress(userId, index, updatedAddress);
    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthRolesGuard)
  @ApiOperation({ summary: 'Eliminar dirección de un usuario específico' })
  @Delete(':userId/address/:index')  
  async deleteAddressAdmin(
    @Param('userId') userId: number,  
    @Param('index') index: number,    
  ) {
    const userResponse = await this.userService.deleteAddress(userId, index);
    return { ok: true, user: userResponse };
  }


  @UseGuards(JwtAuthRolesGuard)
@SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
@ApiOperation({ summary: 'Obtiene todas las direcciones de un usuario específico - Solo Admin' })
@Get(':userId/addresses')
async getUserAddressesAdmin(@Param('userId') userId: number) {
  const addresses = await this.userService.getUserAddressesAdmin(userId);
  return { ok: true, addresses };
}

  // Bloquear un usuario
  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Bloquear un usuario' })
  @Put(':userId/block')  
  async blockUser(@Param('userId') userId: number) {
    const userResponse = await this.userService.blockUser(userId);
    return { ok: true, user: userResponse };
  }

  // Desbloquear un usuario
  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Desbloquear un usuario' })
  @Put(':userId/unblock')  
  async unblockUser(@Param('userId') userId: number) {
    const userResponse = await this.userService.unblockUser(userId);
    return { ok: true, user: userResponse };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @Delete('user')
  async deleteUser(@GetUser() user: User) {
    const userId = parseInt(`${user.id}`, 10);

    await this.userService.deleteUser(userId);

    return { ok: true, message: 'Usuario eliminado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId2/search')
  @ApiOperation({ summary: 'Busqueda de usuario por id' })
  async searchUserById(@Param('userId2') userId2: number) {
    return this.userService.findById(Number(userId2));
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthRolesGuard)
  @Put(':id')
  async updateUserData(@Param('id') userId: number, @Body() userData: updateUserDataDto) {
    const result = await this.userService.updateUser(userData); 
    return { ok: result.ok, updatedUser: result.updatedUser };  
  }
  
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthRolesGuard)
  @Put('update/:id')
  async updateUserDataAdmin(@Param('id') userId: number, @Body() userData: updateUserDataDto) {
    const result = await this.userService.updateUserAdmin({ id: userId, ...userData });
    return result;
  }
}

