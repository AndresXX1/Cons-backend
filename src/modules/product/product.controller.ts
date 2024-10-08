import { Controller, Get, NotFoundException, Param, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene solo productos visibles en el app' })
  @ApiBearerAuth()
  @Get('')
  async getProducts() {
    const products = await this.productService.getProducts();
    const productAllDB = await this.productService.getProductsDB();

    const productsAddMetadata = products.map((product) => {
      const productDB = productAllDB.find((p) => p.api_id === product.id);
      return {
        ...product,
        is_visible: productDB ? productDB.is_visible : true,
      };
    });
    const productsIsVisible = productsAddMetadata.filter((p) => p.is_visible);
    return { ok: true, products: productsIsVisible };
  }

  @ApiOperation({ summary: 'Obtiene los productos de Argen y Finadi' })
  @Get('/contabilium')
  async getContabiliumProducts() {
    const result = await this.productService.getContabiliumProducts();
    return { ok: true, contabiliumProducts: result };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiBearerAuth()
  @Get('all')
  async getProductsAll() {
    const products = await this.productService.getProducts();
    const productAllDB = await this.productService.getProductsDB();

    const productsAddMetadata = products.map((product) => {
      const productDB = productAllDB.find((p) => p.api_id === product.id);
      return {
        ...product,
        is_visible: productDB ? productDB.is_visible : true,
      };
    });
    return { ok: true, products: productsAddMetadata };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Obtiene todos los productos' })
  @ApiBearerAuth()
  @Put('visibility/:productId')
  async changeOfVisibilityProduct(@Param('productId') productId: number) {
    const products = await this.productService.getProducts();
    const existProduct = products.find((p) => p.id === productId);

    if (!existProduct) {
      throw new NotFoundException('Product not found');
    }

    const productDB = await this.productService.getProductDB(productId);

    productDB.is_visible = !productDB.is_visible;
    await this.productService.updateProduct(productDB);

    return {
      ok: true,
      product: {
        ...existProduct,
        is_visible: productDB.is_visible,
      },
    };
  }
}
