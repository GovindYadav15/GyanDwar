import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EsewaGateway } from './gateways/esewa.gateway';
import { KhaltiGateway } from './gateways/khalti.gateway';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, PaymentGateway, PaymentStatus, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private esewaGateway: EsewaGateway,
    private khaltiGateway: KhaltiGateway,
    private configService: ConfigService,
  ) {}

  async initiatePayment(userId: string, planId: string, gateway: PaymentGateway) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) throw new NotFoundException('Subscription plan not available');

    const finalAmount = Math.max(1, Number(plan.priceNpr) - Number(plan.discountNpr));
    const orderNumber = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        planId,
        amountNpr: finalAmount,
        status: OrderStatus.PENDING,
      },
    });

    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:3000');
    const returnUrl =
      gateway === PaymentGateway.ESEWA
        ? `${appUrl}/payments/verify/esewa`
        : `${appUrl}/payments/verify/khalti`;

    const failureUrl = `${appUrl}/payments/failure`;

    let result;
    if (gateway === PaymentGateway.ESEWA) {
      result = await this.esewaGateway.initiatePayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amountNpr: finalAmount,
        productName: plan.name,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phoneNumber || undefined,
        returnUrl,
        failureUrl,
      });
    } else {
      result = await this.khaltiGateway.initiatePayment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        amountNpr: finalAmount,
        productName: plan.name,
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phoneNumber || undefined,
        returnUrl,
        failureUrl,
      });
    }

    // Create initiated payment record
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        gateway,
        amountNpr: finalAmount,
        status: PaymentStatus.INITIATED,
      },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amountNpr: finalAmount,
      gateway,
      paymentUrl: result.paymentUrl,
      formFields: result.formFields,
      pidx: result.pidx,
    };
  }

  async verifyEsewa(encodedData: string) {
    const decoded = Buffer.from(encodedData, 'base64').toString('utf-8');
    const json = JSON.parse(decoded);
    const { transaction_uuid } = json;

    const orderNumber = transaction_uuid.split('_')[1];
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: { plan: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order associated with ${transaction_uuid} not found`);
    }

    if (order.status === OrderStatus.PAID) {
      return {
        success: true,
        message: 'Order was already verified and activated.',
        orderId: order.id,
      };
    }

    const verificationResult = await this.esewaGateway.verifyPayment(
      { encodedData },
      Number(order.amountNpr),
    );

    if (!verificationResult.isVerified) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED },
      });
      throw new BadRequestException(verificationResult.message);
    }

    return this.fulfillOrderAndActivateSubscription(
      order,
      PaymentGateway.ESEWA,
      verificationResult,
    );
  }

  async verifyKhalti(pidx: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { plan: true, user: true },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.status === OrderStatus.PAID) {
      return {
        success: true,
        message: 'Order already completed and active',
        orderId: order.id,
      };
    }

    const verificationResult = await this.khaltiGateway.verifyPayment(
      { pidx },
      Number(order.amountNpr),
    );

    if (!verificationResult.isVerified) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.FAILED },
      });
      throw new BadRequestException(verificationResult.message);
    }

    return this.fulfillOrderAndActivateSubscription(
      order,
      PaymentGateway.KHALTI,
      verificationResult,
    );
  }

  private async fulfillOrderAndActivateSubscription(
    order: any,
    gateway: PaymentGateway,
    verifyResult: any,
  ) {
    const now = new Date();
    const endDate = new Date(now.getTime() + order.plan.durationDays * 24 * 60 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: OrderStatus.PAID },
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          gateway,
          gatewayTransactionId: verifyResult.gatewayTransactionId,
          amountNpr: order.amountNpr,
          status: PaymentStatus.SUCCESS,
          rawResponse: JSON.stringify(verifyResult.rawResponse),
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          userId: order.userId,
          planId: order.planId,
          status: SubscriptionStatus.ACTIVE,
          startDate: now,
          endDate,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: order.userId,
          action: 'PAYMENT_VERIFIED_SUBSCRIPTION_ACTIVATED',
          resourceType: 'Order',
          resourceId: order.id,
          payload: JSON.stringify({
            paymentId: payment.id,
            subscriptionId: subscription.id,
            planName: order.plan.name,
            amount: order.amountNpr,
          }),
        },
      });

      this.logger.log(
        `Subscription activated for User ${order.userId} until ${endDate.toISOString()}`,
      );

      return {
        success: true,
        message: 'Payment verified and subscription activated successfully!',
        orderId: order.id,
        planName: order.plan.name,
        expiresAt: endDate.toISOString(),
      };
    });
  }
}
