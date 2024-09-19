import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  async getRecommendationCupons(@GetUser() user: User) {
    const cupons = await this.cuponService.getRecommendationCupons();
    const cupons2 = await this.cuponService.getRecommendationCupons2();
    const cupons3 = await this.cuponService.getRecommendationCupons3();
    return { ok: true, user, cupons: cupons, cupons2: cupons2, cupons3: cupons3 };
  }

  @ApiOperation({ summary: 'Obtiene la lista de cupones ppor la categoria' })
  @ApiBearerAuth()
  @Get('/:id')
  async getCuponsByCategory(@GetUser() user: User, @Param('id') id: number) {
    const cupons = await this.cuponService.getCuponsByCategory(id);
    return { ok: true, user, cupons: cupons };
  }

  @ApiOperation({ summary: 'Obtiene la lista de cupones' })
  @ApiBearerAuth()
  @Post('create')
  async createCupon(@GetUser() user: User, @Body() createCuponDto: CreateCuponDto) {
    const cupon = await this.cuponService.createCupon(createCuponDto);
    return { ok: true, user, cupon: cupon };
  }
}
