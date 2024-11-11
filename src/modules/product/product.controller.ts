import { Body, Controller, DefaultValuePipe, Get, Param, Post, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { SearchProductDto } from './dto/search-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene solo productos visibles en el ecommerce, buscando y/o filtrando.' })
  @Put() // Put para que se puedan enviar datos por body, pero realmente funciona como get
  async getProducts(@Body() searchProductDto: SearchProductDto, @Query('page', new DefaultValuePipe(1)) page: number, @Query('limit', new DefaultValuePipe(12)) limit: number) {
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

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene todos los productos creados' })
  @ApiBearerAuth()
  @Get('allProducts')
  async getAllProducts() {
    const products = await this.productService.getAllProducts();
    return { ok: true, products };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Crea un nuevo producto' })
  @ApiBearerAuth()
  @Post('create')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(createProductDto);
    return { ok: true, product };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Edita un producto existente' })
  @Put('update/:id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productService.updateProduct(id, updateProductDto);
    return { ok: true, product };
  }
}
