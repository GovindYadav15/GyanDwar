import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const [totalUsers, totalQuestions, totalAssessments, totalOrders, paidOrders, recentAuditLogs] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.question.count(),
        this.prisma.assessment.count(),
        this.prisma.order.count(),
        this.prisma.order.count({ where: { status: 'PAID' } }),
        this.prisma.auditLog.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { email: true, fullName: true } } },
        }),
      ]);

    return {
      totalUsers,
      totalQuestions,
      totalAssessments,
      totalOrders,
      paidOrders,
      conversionRate: totalOrders > 0 ? Number(((paidOrders / totalOrders) * 100).toFixed(1)) : 0,
      recentAuditLogs,
    };
  }

  async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        plan: { select: { name: true, durationDays: true } },
        payments: true,
      },
    });
  }

  async getQuestions(take = 50, skip = 0) {
    return this.prisma.question.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
        options: true,
      },
    });
  }
}
