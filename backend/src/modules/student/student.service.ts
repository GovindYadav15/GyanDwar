import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(userId: string) {
    const attempts = await this.prisma.assessmentAttempt.findMany({
      where: { userId, status: 'SUBMITTED' },
      orderBy: { submittedAt: 'desc' },
      include: {
        assessment: {
          include: {
            subject: true,
          },
        },
      },
    });

    const activeSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
        endDate: { gte: new Date() },
      },
      include: {
        plan: true,
      },
      orderBy: { endDate: 'desc' },
    });

    const totalAttempts = attempts.length;
    const totalScoreObtained = attempts.reduce((acc, a) => acc + Number(a.scoreObtained || 0), 0);
    const totalPossibleMarks = attempts.reduce((acc, a) => acc + Number(a.totalMarks || 0), 0);

    const overallAccuracy =
      totalPossibleMarks > 0
        ? Number(((totalScoreObtained / totalPossibleMarks) * 100).toFixed(1))
        : 0;

    const passCount = attempts.filter((a) => {
      const score = Number(a.scoreObtained || 0);
      const pass = Number(a.assessment.passMarks || 0);
      return score >= pass;
    }).length;

    const passRate = totalAttempts > 0 ? Number(((passCount / totalAttempts) * 100).toFixed(1)) : 0;

    // Recent 5 attempts
    const recentAttempts = attempts.slice(0, 5).map((a) => ({
      id: a.id,
      title: a.assessment.title,
      type: a.assessment.type,
      subjectName: a.assessment.subject?.name || 'General Engineering',
      score: Number(a.scoreObtained),
      totalMarks: Number(a.totalMarks),
      accuracyRate: Number(a.accuracyRate),
      submittedAt: a.submittedAt?.toISOString(),
      isPassed: Number(a.scoreObtained) >= Number(a.assessment.passMarks),
    }));

    return {
      stats: {
        totalAttempts,
        passRate,
        overallAccuracy,
        studyHoursEstimate: Math.round(totalAttempts * 1.5),
      },
      subscription: activeSubscription
        ? {
            planName: activeSubscription.plan.name,
            endDate: activeSubscription.endDate.toISOString(),
            isActive: true,
          }
        : null,
      recentAttempts,
    };
  }
}
