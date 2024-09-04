import { Body, Controller, Get, Post } from '@nestjs/common';
import { CuponService } from './cupon.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';
import { CreateCuponDto } from './dto/create-cupon.dto';

@Controller('cupon')
@ApiTags('cupon')
export class CuponController {
  constructor(private readonly cuponService: CuponService) {}

  @ApiOperation({ summary: 'Obtiene la lista de cupones' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() user: User) {
    const cupons = await this.cuponService.getCupons();
    return { ok: true, user, cupons: cupons };
  }

  @ApiOperation({ summary: 'Obtiene la lista de cupones' })
  @ApiBearerAuth()
  @Post('create')
  async getCreateCupon(@GetUser() user: User, @Body() createCuponDto: CreateCuponDto) {
    const cupon = await this.cuponService.createCupon(createCuponDto);
    return { ok: true, user, cupon: cupon };
  }
}
