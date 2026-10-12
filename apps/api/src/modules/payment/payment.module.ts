import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { EsewaGateway } from './gateways/esewa.gateway';
import { KhaltiGateway } from './gateways/khalti.gateway';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, EsewaGateway, KhaltiGateway],
  exports: [PaymentService, EsewaGateway, KhaltiGateway],
})
export class PaymentModule {}
