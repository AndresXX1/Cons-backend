import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Crea link de Mercado Pago' })
  @Post('create')
  async createPayment(@Body() data) {
    const link = await this.paymentService.createPayment(data);
    return { ok: true, link: link };
  }

  @ApiOperation({ summary: 'Webhook para Mercado Pago' })
  @Post('webhook')
  async webhook(@Body() data) {
    const result = await this.paymentService.webhook(data);
    return { ok: true, result: result };
  }
}
