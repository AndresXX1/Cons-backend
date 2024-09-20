import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene solo productos visibles en el app' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() user: User) {
    const products = await this.productService.getProducts();
    return { ok: true, user, products: products };
  }

  @ApiOperation({ summary: 'Obtiene los productos de Argen y Finadi' })
  @Get('/contabilium')
  async getContabiliumProducts() {
    const result = await this.productService.getContabiliumProducts();
    return { ok: true, contabiliumProducts: result };
  }

  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiBearerAuth()
  @Get('all')
  async getProfileAll(@GetUser() user: User) {
    const products = await this.productService.getProducts();
    return { ok: true, user, products: products };
  }
}
