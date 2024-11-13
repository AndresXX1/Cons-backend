import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { SearchProductDto } from './dto/search-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@models/Products.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    this.logger.log(`Producto creado: ${JSON.stringify(product)}`);
    return product;
  }
  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.logger.log(`Producto con ID ${id} eliminado`);
  }
}
