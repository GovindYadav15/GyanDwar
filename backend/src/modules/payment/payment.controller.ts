import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyEsewaDto } from './dto/verify-esewa.dto';
import { VerifyKhaltiDto } from './dto/verify-khalti.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments & Gateways')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment session with eSewa or Khalti' })
  @ApiResponse({
    status: 201,
    description: 'Payment order created with redirection or form payload',
  })
  async initiate(@CurrentUser('id') userId: string, @Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(userId, dto.planId, dto.gateway);
  }

  @Post('verify/esewa')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Server-side verification of eSewa callback' })
  @ApiResponse({
    status: 200,
    description: 'Cryptographic signature checked & subscription activated',
  })
  async verifyEsewa(@Body() dto: VerifyEsewaDto) {
    return this.paymentService.verifyEsewa(dto.data);
  }

  @Post('verify/khalti')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Server-side verification of Khalti lookup API' })
  @ApiResponse({ status: 200, description: 'Khalti status checked & subscription activated' })
  async verifyKhalti(@Body() dto: VerifyKhaltiDto) {
    return this.paymentService.verifyKhalti(dto.pidx, dto.orderId);
  }
}
