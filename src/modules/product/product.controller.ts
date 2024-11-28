import { Body, Controller, DefaultValuePipe, Get, Param, Post, Put, Query, SetMetadata, UseGuards, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { META_ROLES } from '@infrastructure/constants';
import { RoleAdminType } from '@models/Admin.entity';
import { SearchProductDto } from './dto/search-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { Res, HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import { Response } from 'express';
import { diskStorage } from 'multer';
const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Obtiene solo productos visibles en el ecommerce, buscando y/o filtrando.' })
  @Get()
  async getProducts(@Body() searchProductDto: SearchProductDto, @Query('page', new DefaultValuePipe(1)) page: number, @Query('limit', new DefaultValuePipe(12)) limit: number) {
    const products = await this.productService.searchProductsEcommerce(searchProductDto, page, limit);
    return { ok: true, products };
  }

  @ApiOperation({ summary: 'Obtiene todos los productos del ecommerce' })
  @ApiBearerAuth()
  @Get('all')
  async getProductsAll() {
    const products = await this.productService.getAllProductsEcommerce();
    return { ok: true, products };
  }

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
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new HttpException('Only image files are allowed', HttpStatus.UNSUPPORTED_MEDIA_TYPE), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/products/',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now().toString();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('An image file is required', HttpStatus.BAD_REQUEST);
    const imageUrl = `/images/products/${file.filename}`;
    const product = await this.productService.createProduct(createProductDto, imageUrl);
    return { ok: true, product };
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @ApiOperation({ summary: 'Edita un producto existente' })
  @ApiBearerAuth()
  @Put('update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(req, file, callback) {
        if (!allowedFileExtensions.includes(file.originalname.split('.').pop() ?? '')) {
          return callback(new HttpException('Only image files are allowed', HttpStatus.UNSUPPORTED_MEDIA_TYPE), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/products/',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now().toString();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    }),
  )
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = `/images/products/${file.filename}`;
    }
    const product = await this.productService.updateProduct(id, updateProductDto, imageUrl);
    return { ok: true, product };
  }

  @Get('images/:imageName')
  async getProductImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = path.join(__dirname, '..', 'uploads/products', imageName);

    if (!fs.existsSync(imagePath)) {
      throw new HttpException('Imagen no encontrada', HttpStatus.NOT_FOUND);
    }

 
    res.sendFile(imagePath);
  }

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.SUPER_ADMIN, RoleAdminType.ADMIN])
  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: number) {
    const result = await this.productService.deleteProduct(id);
    if (result.ok) {
      return { ok: true, message: 'Product deleted successfully' };
    } else {
      throw new HttpException('Failed to delete product', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('deleteAdmin/:id')
  async deleteProductAdmin(@Param('id') id: number) {
    const result = await this.productService.deleteProductAdmin(id);
    if (result.ok) {
      return { ok: true, message: 'Producto eliminado correctamente' };
    } else {
      throw new HttpException('Error al eliminar el producto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
