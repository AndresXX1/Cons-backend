import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '@infrastructure/decorators/get-user.decorator';
import { User } from '@models/User.entity';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene la lista de productos' })
  @ApiBearerAuth()
  @Get('')
  async getProfile(@GetUser() user: User) {
    const products = await this.productService.getProducts();
    return { ok: true, user, products: products };
  }
}
