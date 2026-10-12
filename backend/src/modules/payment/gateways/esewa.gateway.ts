import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import {
  IPaymentGateway,
  InitiatePaymentParams,
  PaymentInitiateResult,
  PaymentVerifyResult,
} from './payment-gateway.interface';
import { PaymentGateway, PaymentStatus } from '@prisma/client';

@Injectable()
export class EsewaGateway implements IPaymentGateway {
  private readonly logger = new Logger(EsewaGateway.name);
  private readonly merchantCode: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.merchantCode = this.configService.get<string>('ESEWA_MERCHANT_CODE', 'EPAYTEST');
    this.secretKey = this.configService.get<string>('ESEWA_SECRET_KEY', '8gBm/:&EnhH.1/q');
    this.baseUrl = this.configService.get<string>('ESEWA_BASE_URL', 'https://rc-epay.esewa.com.np');
  }

  generateSignature(totalAmount: string, transactionUuid: string, productCode: string): string {
    const data = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const hmac = createHmac('sha256', this.secretKey);
    hmac.update(data);
    return hmac.digest('base64');
  }

  async initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiateResult> {
    const totalAmount = params.amountNpr.toString();
    const transactionUuid = `TXN_${params.orderNumber}_${Date.now()}`;
    const signature = this.generateSignature(totalAmount, transactionUuid, this.merchantCode);

    const formFields: Record<string, string> = {
      amount: totalAmount,
      tax_amount: '0',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: this.merchantCode,
      product_service_charge: '0',
      product_delivery_charge: '0',
      success_url: params.returnUrl,
      failure_url: params.failureUrl || params.returnUrl,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature,
    };

    return {
      gateway: PaymentGateway.ESEWA,
      paymentUrl: `${this.baseUrl}/api/epay/main/v2/form`,
      formFields,
    };
  }

  async verifyPayment(
    payload: { encodedData: string },
    expectedAmountNpr: number,
  ): Promise<PaymentVerifyResult> {
    try {
      // Decode Base64 data from eSewa redirect
      const decodedString = Buffer.from(payload.encodedData, 'base64').toString('utf-8');
      const responseObj = JSON.parse(decodedString);

      const {
        transaction_code,
        status,
        total_amount,
        transaction_uuid,
        product_code,
        signature: receivedSignature,
      } = responseObj;

      // Re-generate expected signature
      const expectedSignature = this.generateSignature(
        total_amount,
        transaction_uuid,
        product_code,
      );

      const isSignatureValid = expectedSignature === receivedSignature;
      const isStatusComplete = status === 'COMPLETE' || status === 'COMPLETED';
      const isAmountValid = Math.abs(Number(total_amount) - expectedAmountNpr) < 0.01;

      if (!isSignatureValid) {
        this.logger.warn(
          `eSewa signature mismatch: expected ${expectedSignature}, received ${receivedSignature}`,
        );
        return {
          isVerified: false,
          status: PaymentStatus.FAILED,
          gatewayTransactionId: transaction_code || '',
          amountNpr: Number(total_amount),
          rawResponse: responseObj,
          message: 'Cryptographic signature verification failed',
        };
      }

      if (!isAmountValid) {
        this.logger.warn(
          `eSewa amount mismatch: expected ${expectedAmountNpr}, received ${total_amount}`,
        );
        return {
          isVerified: false,
          status: PaymentStatus.FAILED,
          gatewayTransactionId: transaction_code || '',
          amountNpr: Number(total_amount),
          rawResponse: responseObj,
          message: 'Payment amount mismatch',
        };
      }

      if (!isStatusComplete) {
        return {
          isVerified: false,
          status: PaymentStatus.FAILED,
          gatewayTransactionId: transaction_code || '',
          amountNpr: Number(total_amount),
          rawResponse: responseObj,
          message: `eSewa transaction status was ${status}`,
        };
      }

      return {
        isVerified: true,
        status: PaymentStatus.SUCCESS,
        gatewayTransactionId: transaction_code || transaction_uuid,
        amountNpr: Number(total_amount),
        rawResponse: responseObj,
        message: 'eSewa transaction verified successfully',
      };
    } catch (err: any) {
      this.logger.error('Error during eSewa verification', err);
      return {
        isVerified: false,
        status: PaymentStatus.FAILED,
        gatewayTransactionId: '',
        amountNpr: 0,
        rawResponse: { error: err.message },
        message: `Verification exception: ${err.message}`,
      };
    }
  }
}
