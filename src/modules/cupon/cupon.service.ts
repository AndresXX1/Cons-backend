import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as DeviceDetector from 'device-detector-js';
import { CreateCuponDto } from './dto/create-cupon.dto';

@Injectable()
export class CuponService {
  private readonly deviceDetector = new DeviceDetector();
  private readonly logger = new Logger(CuponService.name);
  private readonly url_api = 'https://apiv1.cuponstar.com/api';

  constructor(private readonly configService: ConfigService) {}

  async getCupons() {
    try {
      const response = await axios.get(`${this.url_api}/cupones`, {
        params: {
          key: 'ZOBEemSOWqU4wvIWEiWXgqDQfSALSKLbBjIZMPzYla9CYzKzZt7Y0CYCqva2V4DV',
          micrositio_id: 910752,
          codigo_afiliado: 12345678,
        },
      });

      return response.data.results;
    } catch (error) {
      this.logger.debug(error);
      return [];
    }
  }

  async createCupon(createCuponDto: CreateCuponDto) {
    try {
      const data = {
        key: 'ZOBEemSOWqU4wvIWEiWXgqDQfSALSKLbBjIZMPzYla9CYzKzZt7Y0CYCqva2V4DV',
        micrositio_id: 910752,
        codigo_afiliado: 12345678,
      };

      const response = await axios.post(`${this.url_api}/texto-sms/${createCuponDto.id}`, data);

      return response.data.success;
    } catch (error) {
      this.logger.debug(error);
      return null;
    }
  }
}
