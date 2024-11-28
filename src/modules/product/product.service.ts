import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SearchProductDto } from './dto/search-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@models/Products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

const IMAGE_UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'products');

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async searchProductsEcommerce(searchProductDto: SearchProductDto, page: number, limit: number) {
    const response = await axios.put(`https://back7.maylandlabs.com/api/product`, searchProductDto, { params: { page, limit } });

    return response.data.foundProducts;
  }

  async getAllProductsEcommerce() {
    const response = await axios.get('https://back7.maylandlabs.com/api/product/all');

    return response.data.allProducts;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async createProduct(createProductDto: CreateProductDto, imageUrl?: string): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    if (imageUrl) {
      product.image = imageUrl;
    }
    product.deleted = false;
    await this.productRepository.save(product);
    return product;
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto, imageUrl?: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    if (imageUrl) {
      product.image = imageUrl;
    }

    await this.productRepository.save(product);
    return product;
  }

  async deleteProduct(id: number): Promise<{ ok: boolean }> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }

      // Eliminar la imagen asociada
      if (product.image) {
        const imagePath = path.join(process.cwd(), 'uploads', 'products', product.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Marcar el producto como eliminado
      product.deleted = true;
      await this.productRepository.save(product);

      return { ok: true };
    } catch (error) {
      this.logger.error('Error al eliminar el producto:', error);
      return { ok: false };
    }

    
  }
  async deleteProductAdmin(id: number): Promise<{ ok: boolean }> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
  
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
  
    
      await this.productRepository.remove(product);
  
      return { ok: true };
    } catch (error) {
      this.logger.error('Error al eliminar el producto:', error);
      return { ok: false };
    }
  }
}  

