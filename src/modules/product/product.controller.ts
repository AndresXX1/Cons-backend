import { Body, Controller, DefaultValuePipe, Get, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { SearchProductDto } from './dto/search-product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene solo productos visibles en el ecommerce, buscando y/o filtrando.' })
  @Put() // Put para que se puedan enviar datos por body, pero realmente funciona como get
  async getProducts(
    @Body() searchProductDto: SearchProductDto,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(12)) limit: number,
  ) {
    const products = await this.productService.searchProductsEcommerce(searchProductDto, page, limit);
    return { ok: true, products };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene todos los productos del ecommerce' })
  @ApiBearerAuth()
  @Get('all')
  async getProductsAll() {
    const products = await this.productService.getAllProductsEcommerce();
    return { ok: true, products };
  }
}
