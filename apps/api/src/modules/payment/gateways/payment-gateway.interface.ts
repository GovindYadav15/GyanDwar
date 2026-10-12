import { PaymentGateway, PaymentStatus } from '@prisma/client';

export interface InitiatePaymentParams {
  orderId: string;
  orderNumber: string;
  amountNpr: number;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
  failureUrl?: string;
}

export interface PaymentInitiateResult {
  gateway: PaymentGateway;
  paymentUrl: string;
  formFields?: Record<string, string>;
  pidx?: string;
}

export interface PaymentVerifyResult {
  isVerified: boolean;
  status: PaymentStatus;
  gatewayTransactionId: string;
  amountNpr: number;
  rawResponse: Record<string, any>;
  message: string;
}

export interface IPaymentGateway {
  initiatePayment(params: InitiatePaymentParams): Promise<PaymentInitiateResult>;
  verifyPayment(payload: any, expectedAmountNpr: number): Promise<PaymentVerifyResult>;
}
