import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import axios from 'axios';
import * as DeviceDetector from 'device-detector-js';

@Injectable()
export class ProductService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly configService: ConfigService) {}

  async updateProducts() {
    console.log('updateProducts');
    // console.log(this.configService.get<string>('shop.clientSecret'))
    // const resultProducts = await axios.get(`https://api.tiendanube.com/v1/${this.configService.get<string>('shop.shopId')}/products`, {
    //   headers: {
    //     'Content-type': 'application/json',
    //     Authorization: `bearer ${this.configService.get<string>('shop.clientSecret')}`,
    //   },
    // });
    // console.log('resultProducts', resultProducts.data);
  }
}
