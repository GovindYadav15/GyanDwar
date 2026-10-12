# ADR 0003: Unified Payment Gateway Abstraction for eSewa & Khalti

## Context

Nepal has two dominant digital payment providers: eSewa and Khalti. Each has different API designs, signature schemes, and callback mechanisms. In the future, Fonepay or ConnectIPS may be added.

## Decision

Create an abstract `PaymentGatewayAdapter` interface with methods:

- `initiatePayment(order: Order): Promise<PaymentInitiationResult>`
- `verifyPayment(payload: PaymentVerificationDto): Promise<PaymentVerificationResult>`

Implement provider-specific adapters (`EsewaAdapter`, `KhaltiAdapter`) injected through a strategy factory.

## Consequences

- Clean separation between core subscription billing logic and third-party gateway quirks.
- Adding a new gateway requires writing only an adapter and registering it in the factory.
