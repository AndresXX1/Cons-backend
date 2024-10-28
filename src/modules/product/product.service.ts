import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  async searchProductsEcommerce(searchProductDto: SearchProductDto, page: number, limit: number) {
    const response = await axios.put(`https://back7.maylandlabs.com/api/product`, searchProductDto, { params: { page, limit } });

    return response.data.foundProducts;
  }

  async getAllProductsEcommerce() {
    const response = await axios.get('https://back7.maylandlabs.com/api/product/all');

    return response.data.allProducts;
  }
}
