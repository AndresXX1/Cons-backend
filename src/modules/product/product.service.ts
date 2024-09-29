import { Product } from '@models/Product.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as DeviceDetector from 'device-detector-js';
import * as qs from 'qs';
import { Repository } from 'typeorm';
@Injectable()
export class ProductService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(ProductService.name);
  private finadiToken = '';
  private argenToken = '';
  private tokensExpires = new Date();

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly configService: ConfigService,
  ) {}

  async getProducts() {
    try {
      const url = `https://api.tiendanube.com/v1/1358466/products`;

      const response = await axios.get(url, {
        headers: { Authentication: `bearer 14ef97c062b522301c4b78ac0b236ef8b52af5d4`, 'Content-Type': 'application/json' },
      });

      //this.logger.debug(response.data);

      return response.data;
    } catch (error) {
      this.logger.debug(error);
      return [];
    }
  }

  async updateProducts() {
    console.log('updateProducts');
    // try {
    //   const resultProducts = await axios.get(`https://api.tiendanube.com/v1/${this.configService.get<string>('shop.shopId')}/products`, {
    //     headers: {
    //       'Content-type': 'application/json',
    //       Authorization: `bearer ${this.configService.get<string>('shop.clientSecret')}`,
    //       'User-Agent': 'MyApp (bramos@argenpesos.com.ar)',
    //     },
    //   });
    // } catch (error) {
    //   console.log(error.response.data);
    // }
    // console.log('resultProducts', resultProducts.data);
  }
  async refreshTokens() {
    try {
      const newFinadiToken = await axios.post(
        'https://rest.contabilium.com/token',
        qs.stringify({
          grant_type: 'client_credentials',
          client_id: this.configService.get<string>('CLIENT_ID_FINADI'),
          client_secret: this.configService.get<string>('CLIENT_SECRET_FINADI'),
        }),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const newArgenToken = await axios.post(
        'https://rest.contabilium.com/token',
        qs.stringify({
          grant_type: 'client_credentials',
          client_id: this.configService.get<string>('CLIENT_ID_ARGEN'),
          client_secret: this.configService.get<string>('CLIENT_SECRET_ARGEN'),
        }),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        },
      );
      this.argenToken = newArgenToken.data.access_token;
      this.finadiToken = newFinadiToken.data.access_token;
      const today = Math.floor(Date.now() / 1000);
      this.tokensExpires = new Date((today + newFinadiToken.data.expires_in) * 1000);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  validateTokenExpiration(): boolean {
    const now = new Date();
    return now < this.tokensExpires;
  }

  async getContabiliumProducts() {
    try {
      if (!this.validateTokenExpiration()) {
        console.log('refreshing');
        await this.refreshTokens();
      }
      const finadiProducts = await this.fetchAllProducts(this.finadiToken);
      const argenProducts = await this.fetchAllProducts(this.argenToken);

      const resultProducts = { finadi: finadiProducts, argen: argenProducts };
      return resultProducts;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  fetchAllProducts = async (token: string) => {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(`https://rest.contabilium.com/api/conceptos/search?pageSize=0&page=${page}`, {
        headers: {
          authorization: `bearer ${token}`,
          'content-Type': 'application/json',
        },
      });
      allProducts = [...allProducts, ...response.data.Items];

      if (response.data.TotalItems > page * 50) {
        page++;
      } else {
        hasMore = false;
      }
    }

    return allProducts;
  };

  async getProductsDB() {
    return await this.productRepository.find({});
  }

  async getProductDB(productId: number) {
    const productDB = await this.productRepository.findOne({
      where: {
        api_id: productId,
      },
    });

    if (!productDB) {
      const newProduct = new Product();
      newProduct.api_id = productId;
      newProduct.is_visible = true;
      await this.productRepository.save(newProduct);
      return newProduct;
    }

    return productDB;
  }

  async updateProduct(product: Product) {
    await this.productRepository.save(product);
  }
}
