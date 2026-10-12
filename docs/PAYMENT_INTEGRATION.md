# Payment Gateway Integration Guide: eSewa & Khalti

This platform implements official integrations for Nepal's primary payment systems: **eSewa EPAY v2** and **Khalti ePayment v2**.

## 1. High-Level Gateway Architecture

```
User (Browser)               NestJS API Server             eSewa / Khalti Server
      |                              |                                |
      |--- 1. Select Plan ---------->|                                |
      |                              |--- 2. Create Order & Token --->|
      |<-- 3. Return Form/Redirect --|                                |
      |                              |                                |
      |--- 4. Complete Payment -------------------------------------->|
      |<-- 5. Gateway Redirect ---------------------------------------|
      |       (With Token/Encoded Data)                               |
      |                              |                                |
      |--- 6. Submit for Verify ---->|                                |
      |                              |--- 7. Server-to-Server Lookup->|
      |                              |<-- 8. Validated Status --------|
      |                              |--- 9. Idempotent Activate DB --|
      |<-- 10. Subscription Ready ---|
```

---

## 2. eSewa EPAY v2 Integration Details

### 2.1 Protocol & Endpoints

- **Sandbox URL**: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- **Sandbox Merchant Code**: `EPAYTEST`
- **Sandbox Secret Key**: `8gBm/:&EnhH.1/q`
- **Transaction Status Check**: `https://rc.esewa.com.np/mobile/api/v2/CheckTransactionStatus`

### 2.2 Signature Calculation

eSewa v2 requires an HMAC-SHA256 signature generated over the string:
`total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}` using the merchant's secret key, encoded in Base64.

```typescript
import { createHmac } from 'crypto';

export function generateEsewaSignature(
  totalAmount: string,
  transactionUuid: string,
  productCode: string,
  secretKey: string,
): string {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = createHmac('sha256', secretKey);
  hmac.update(message);
  return hmac.digest('base64');
}
```

### 2.3 Verification Workflow

On redirect to `success_url`, eSewa sends an encoded `?data=` query parameter containing a Base64 JSON object with `transaction_uuid`, `total_amount`, and `signature`.
The API:

1. Re-computes the signature using the server secret key.
2. Checks that the calculated signature matches the received signature.
3. Invokes the eSewa status verification endpoint.
4. Checks that the payment has not previously been marked as processed (`idempotency`).
5. Updates Order status to `PAID` and provisions the User's `Subscription` record within a Prisma transaction.

---

## 3. Khalti ePayment v2 Integration Details

### 3.1 Protocol & Endpoints

- **Sandbox Initiate URL**: `https://a.khalti.com/api/v2/epayment/initiate/`
- **Sandbox Verification URL**: `https://a.khalti.com/api/v2/epayment/lookup/`
- **Auth Header**: `Authorization: Key <KHALTI_SECRET_KEY>`

### 3.2 Initiation Payload

```json
{
  "return_url": "http://localhost:3000/payments/verify/khalti",
  "website_url": "http://localhost:3000",
  "amount": 99900, // in Paisa (999.00 NPR * 100)
  "purchase_order_id": "ord_88291",
  "purchase_order_name": "ExamSathi Monthly Pass",
  "customer_info": {
    "name": "Aayush Sharma",
    "email": "student@example.com",
    "phone": "9841234567"
  }
}
```

Khalti responds with `pidx` and `payment_url`.

### 3.3 Verification Workflow

On client return with `pidx`, the API server executes a POST to Khalti's `/epayment/lookup/`:

```json
{ "pidx": "kPidx_..." }
```

If Khalti returns `status === "Completed"` and `total_amount === expectedAmountPaisa`:

- Confirm order has not already been processed.
- Activate subscription.

---

## 4. Idempotency & Fault Tolerance

1. **Double-Click & Multi-Callback Defense**: Orders maintain an atomic state machine:
   `PENDING` -> `PROCESSING` -> `PAID` or `FAILED`.
   Database unique constraints on `Payment.gatewayTransactionId` prevent duplicate execution.
2. **Transaction Boundaries**:
   All state updates (Order state + Payment record + Subscription creation + Audit log) are executed inside a single `prisma.$transaction`.
