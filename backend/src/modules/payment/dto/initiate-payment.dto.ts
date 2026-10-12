import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentGateway } from '@prisma/client';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'plan-quarterly-uuid' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ enum: PaymentGateway, example: PaymentGateway.ESEWA })
  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;
}
