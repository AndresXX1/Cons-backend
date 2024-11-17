import {
  Controller,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  Param,
  SetMetadata,
  UseGuards,
  DefaultValuePipe,
  Query,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthRolesGuard } from '@modules/auth/guards/jwt-auth-roles.guard';
import { RoleAdminType } from '@models/Admin.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';
import {META_ROLES} from "../../infrastructure/constants"

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Post('create')
  @ApiOperation({ summary: 'Crea un nuevo producto' })
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('imageFile', {  // Usamos 'imageFile' como nombre del campo en el formulario
      fileFilter: (req, file, callback) => {
        const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp']; // Definir las extensiones aquí
        const extension = file.originalname.split('.').pop();
        if (!allowedFileExtensions.includes(extension!)) {
          return callback(new UnsupportedMediaTypeException('Archivo no permitido'), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/products/',  // Guardar en la carpeta 'products'
        filename: (req, file, callback) => {
          const uniqueSuffix = uuid.v4();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    })
  )
  async createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    // Si hay un archivo, se agrega el nombre del archivo a la DTO, si no, se asigna un valor predeterminado
    createProductDto.image = file ? file.filename : 'default.jpg';  // Valor predeterminado si no se sube imagen
    
    const product = await this.productService.createProduct(createProductDto);
    return { ok: true, product };
  }
  

  @UseGuards(JwtAuthRolesGuard)
  @SetMetadata(META_ROLES, [RoleAdminType.ADMIN, RoleAdminType.SUPER_ADMIN])
  @Put('update/:id')
  @ApiOperation({ summary: 'Edita un producto existente' })
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('imageFile', {  // Usamos 'imageFile' como nombre del campo en el formulario
      fileFilter: (req, file, callback) => {
        const allowedFileExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];  // Definir las extensiones aquí también
        const extension = file.originalname.split('.').pop();
        if (!allowedFileExtensions.includes(extension!)) {
          return callback(new UnsupportedMediaTypeException('Archivo no permitido'), false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/products/',  // Guardar en la carpeta 'products'
        filename: (req, file, callback) => {
          const uniqueSuffix = uuid.v4();
          const extension = file.originalname.split('.').pop();
          const uniqueFilename = `${uniqueSuffix}.${extension}`;
          callback(null, uniqueFilename);
        },
      }),
    })
  )
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile() file: Express.Multer.File) {
    // Si hay un archivo, actualizamos el nombre de la imagen, si no, asignamos un valor predeterminado
    updateProductDto.image = file ? file.filename : 'default.jpg';  // Valor predeterminado si no se sube imagen
    
    const product = await this.productService.updateProduct(id, updateProductDto);
    return { ok: true, product };
  }
}
