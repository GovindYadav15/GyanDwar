import { EsewaGateway } from './esewa.gateway';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '@prisma/client';

describe('EsewaGateway (Official EPAY v2 HMAC-SHA256)', () => {
  let gateway: EsewaGateway;

  beforeEach(() => {
    const mockConfigService = {
      get: (key: string, defaultValue: any) => {
        if (key === 'ESEWA_MERCHANT_CODE') return 'EPAYTEST';
        if (key === 'ESEWA_SECRET_KEY') return '8gBm/:&EnhH.1/q';
        if (key === 'ESEWA_BASE_URL') return 'https://rc-epay.esewa.com.np';
        return defaultValue;
      },
    } as unknown as ConfigService;

    gateway = new EsewaGateway(mockConfigService);
  });

  it('should generate valid HMAC-SHA256 signature for initiation', () => {
    const totalAmount = '100';
    const transactionUuid = 'TXN_TEST_123';
    const productCode = 'EPAYTEST';

    const signature = gateway.generateSignature(totalAmount, transactionUuid, productCode);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(10);
  });

  it('should verify payment successfully when signature and amounts match', async () => {
    const totalAmount = '999';
    const transactionUuid = 'TXN_ORD_001_1700000000';
    const productCode = 'EPAYTEST';
    const validSignature = gateway.generateSignature(totalAmount, transactionUuid, productCode);

    const payloadObj = {
      transaction_code: 'ESW_TXN_998877',
      status: 'COMPLETE',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      signature: validSignature,
    };

    const encodedData = Buffer.from(JSON.stringify(payloadObj)).toString('base64');
    const result = await gateway.verifyPayment({ encodedData }, 999.0);

    expect(result.isVerified).toBe(true);
    expect(result.status).toBe(PaymentStatus.SUCCESS);
    expect(result.gatewayTransactionId).toBe('ESW_TXN_998877');
    expect(result.amountNpr).toBe(999);
  });

  it('should reject payment verification when signature is forged', async () => {
    const payloadObj = {
      transaction_code: 'ESW_TXN_998877',
      status: 'COMPLETE',
      total_amount: '999',
      transaction_uuid: 'TXN_ORD_001_1700000000',
      product_code: 'EPAYTEST',
      signature: 'invalid_forged_signature_hash',
    };

    const encodedData = Buffer.from(JSON.stringify(payloadObj)).toString('base64');
    const result = await gateway.verifyPayment({ encodedData }, 999.0);

    expect(result.isVerified).toBe(false);
    expect(result.status).toBe(PaymentStatus.FAILED);
    expect(result.message).toContain('Cryptographic signature verification failed');
  });

  it('should reject payment if verified amount does not match expected order amount', async () => {
    const totalAmount = '500'; // paid 500 instead of 999
    const transactionUuid = 'TXN_ORD_001_1700000000';
    const productCode = 'EPAYTEST';
    const signature = gateway.generateSignature(totalAmount, transactionUuid, productCode);

    const payloadObj = {
      transaction_code: 'ESW_TXN_998877',
      status: 'COMPLETE',
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: productCode,
      signature,
    };

    const encodedData = Buffer.from(JSON.stringify(payloadObj)).toString('base64');
    const result = await gateway.verifyPayment({ encodedData }, 999.0);

    expect(result.isVerified).toBe(false);
    expect(result.status).toBe(PaymentStatus.FAILED);
    expect(result.message).toContain('Payment amount mismatch');
  });
});
