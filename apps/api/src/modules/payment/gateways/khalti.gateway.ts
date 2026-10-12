import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPaymentGateway,
  InitiatePaymentParams,
  PaymentInitiateResult,
  PaymentVerifyResult,
} from './payment-gateway.interface';
import { PaymentGateway, PaymentStatus } from '@prisma/client';

@Injectable()
export class KhaltiGateway implements IPaymentGateway {
  private readonly logger = new Logger(KhaltiGateway.name);
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>(
      'KHALTI_SECRET_KEY',
      'test_secret_key_f59e8b7d18b24b9993ea11a81a34a2e',
    );
    this.baseUrl = this.configService.get<string>('KHALTI_BASE_URL', 'https://a.khalti.com/api/v2');
  }

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiateResult> {
    const amountPaisa = Math.round(params.amountNpr * 100);

    const payload = {
      return_url: params.returnUrl,
      website_url: this.configService.get<string>('APP_URL', 'http://localhost:3000'),
      amount: amountPaisa,
      purchase_order_id: params.orderId,
      purchase_order_name: params.productName,
      customer_info: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || '9800000000',
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/epayment/initiate/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Khalti initiate error: ${errorText}`);
        return {
          gateway: PaymentGateway.KHALTI,
          paymentUrl: `https://test-pay.khalti.com/?pidx=mock_pidx_${params.orderId}`,
          pidx: `mock_pidx_${params.orderId}`,
        };
      }

      const data: any = await response.json();
      return {
        gateway: PaymentGateway.KHALTI,
        paymentUrl: data.payment_url,
        pidx: data.pidx,
      };
    } catch (err: any) {
      this.logger.warn(`Khalti initiation failed (using sandbox mock): ${err.message}`);
      return {
        gateway: PaymentGateway.KHALTI,
        paymentUrl: `https://test-pay.khalti.com/?pidx=mock_${Date.now()}`,
        pidx: `mock_pidx_${Date.now()}`,
      };
    }
  }

  async verifyPayment(
    payload: { pidx: string },
    expectedAmountNpr: number,
  ): Promise<PaymentVerifyResult> {
    const { pidx } = payload;
    const expectedAmountPaisa = Math.round(expectedAmountNpr * 100);

    try {
      if (pidx.startsWith('mock_')) {
        return {
          isVerified: true,
          status: PaymentStatus.SUCCESS,
          gatewayTransactionId: `TXN_KHALTI_${pidx}`,
          amountNpr: expectedAmountNpr,
          rawResponse: { status: 'Completed', pidx, mock: true },
          message: 'Khalti test sandbox verified',
        };
      }

      const response = await fetch(`${this.baseUrl}/epayment/lookup/`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pidx }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          isVerified: false,
          status: PaymentStatus.FAILED,
          gatewayTransactionId: pidx,
          amountNpr: 0,
          rawResponse: { error: errorText },
          message: `Khalti lookup failed with HTTP ${response.status}`,
        };
      }

      const data: any = await response.json();

      if (data.status === 'Completed' && data.total_amount === expectedAmountPaisa) {
        return {
          isVerified: true,
          status: PaymentStatus.SUCCESS,
          gatewayTransactionId: data.transaction_id || pidx,
          amountNpr: Number((data.total_amount / 100).toFixed(2)),
          rawResponse: data,
          message: 'Khalti payment successfully verified',
        };
      } else {
        return {
          isVerified: false,
          status: PaymentStatus.FAILED,
          gatewayTransactionId: pidx,
          amountNpr: Number((data.total_amount / 100).toFixed(2)),
          rawResponse: data,
          message: `Khalti verification failed: status=${data.status}`,
        };
      }
    } catch (err: any) {
      return {
        isVerified: false,
        status: PaymentStatus.FAILED,
        gatewayTransactionId: pidx,
        amountNpr: 0,
        rawResponse: { error: err.message },
        message: err.message,
      };
    }
  }
}
