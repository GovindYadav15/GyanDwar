import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priceNpr: 'asc' },
      include: {
        entitlements: {
          include: { category: true },
        },
      },
    });
  }

  async getUserSubscriptions(userId: string) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: {
          include: {
            entitlements: {
              include: { category: true },
            },
          },
        },
      },
    });

    const now = new Date();
    return subscriptions.map((sub) => {
      const daysRemaining = Math.max(
        0,
        Math.ceil((new Date(sub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );

      return {
        id: sub.id,
        planName: sub.plan.name,
        status: sub.status,
        startDate: sub.startDate,
        endDate: sub.endDate,
        daysRemaining,
        isActive: sub.status === 'ACTIVE' && new Date(sub.endDate) > now,
        coveredCategories: sub.plan.entitlements.map((e) => e.category.title),
      };
    });
  }
}
