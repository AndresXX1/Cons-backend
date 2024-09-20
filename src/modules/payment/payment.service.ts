import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly client: MercadoPagoConfig;
  private readonly preference: Preference;
  private readonly payment: Payment;

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get('mercadopago.accessToken');
    this.client = new MercadoPagoConfig({ accessToken });
    this.preference = new Preference(this.client);
    this.payment = new Payment(this.client);
  }

  // falta declarar data a pasar, por ahora solo prop "price" que debe ser un int
  async createPayment(data) {
    try {
      const response = await this.preference.create({
        body: {
          items: [
            {
              id: '1',
              title: 'Argencompra',
              quantity: 1,
              unit_price: data.price,
            },
          ],
          payment_methods: { excluded_payment_types: [{ id: 'ticket' }] },
          notification_url: `${this.configService.get<string>('mercadopago.notificationUrl')}/api/payment/webhook`,
        },
      });

      return response.init_point;
    } catch (error) {
      if (error.status && error.message) return { ok: false, message: error.message, errorCode: error.status };
      return null;
    }
  }

  async webhook(data) {
    if (data.type == 'payment') {
      const payment = await this.payment.get({ id: data.data.id });

      if (payment.status === 'approved') {
        // acá va lógica de actualización de status en el modelo de order
        this.logger.log('Pago aprobado.');
      }
    }
  }
}
