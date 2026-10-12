import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCourseOrderDto } from './dto/course-order.dto';

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

    const enrolledCourses = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
        enrolledCoursesCount: enrolledCourses.filter((e) => e.status === 'ACTIVE').length,
      },
      subscription: activeSubscription
        ? {
            planName: activeSubscription.plan.name,
            endDate: activeSubscription.endDate.toISOString(),
            isActive: true,
          }
        : null,
      enrolledCourses: enrolledCourses.map((e) => ({
        id: e.id,
        courseTitle: e.courseTitle,
        status: e.status,
        verifiedAt: e.verifiedAt?.toISOString() || null,
      })),
      recentAttempts,
    };
  }

  async getAvailableCourses() {
    const courses = await this.prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          include: {
            resources: true,
            _count: { select: { questions: true } },
          },
        },
      },
    });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      categoryCode: c.categoryCode || 'GENERAL',
      faculty: c.faculty || 'Engineering',
      badge: c.badge || 'Official Curriculum',
      rating: 4.9,
      reviewsCount: 150,
      originalPriceNpr: c.originalPriceNpr ? Number(c.originalPriceNpr) : Math.round(Number(c.priceNpr) * 1.4),
      priceNpr: Number(c.priceNpr),
      duration: c.duration || `${c.chapters.length * 15 || 60}+ Study Hours`,
      totalMocks: c.chapters.reduce((sum, ch) => sum + (ch._count?.questions > 0 ? 1 : 0), 0) || 5,
      features: c.features ? JSON.parse(c.features) : [
        'Complete Chapter Syllabus & Study PDFs',
        'Chapter-wise MCQ Questions & Explanations',
        'Official Exam Pattern Verification',
      ],
      chapters: c.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        chapterNumber: ch.chapterNumber,
        isFreePreview: ch.isFreePreview,
        resourceCount: ch.resources.length,
        questionCount: ch._count.questions,
      })),
    }));
  }

  async createCourseOrder(userId: string, dto: CreateCourseOrderDto) {
    if (!dto.courseIds || dto.courseIds.length === 0) {
      throw new BadRequestException('At least one course must be selected');
    }
    if (!dto.receiptImageUrl) {
      throw new BadRequestException('Payment receipt screenshot is required');
    }

    const availableCourses = await this.getAvailableCourses();
    const selected = availableCourses.filter((c) => dto.courseIds.includes(c.id));

    if (selected.length === 0) {
      throw new BadRequestException('Selected course identifiers are invalid');
    }

    const totalAmount = selected.reduce((sum, c) => sum + c.priceNpr, 0);
    const orderNumber = `ORD-ES-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    return this.prisma.$transaction(async (tx) => {
      // Find a plan matching or default plan
      const defaultPlan = await tx.subscriptionPlan.findFirst();

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          planId: defaultPlan?.id || null,
          amountNpr: totalAmount,
          status: 'PENDING',
          receiptImageUrl: dto.receiptImageUrl,
          transactionCode: dto.transactionCode || null,
          paymentRemarks: dto.paymentRemarks || null,
        },
      });

      // Create CourseEnrollments for each selected course
      for (const course of selected) {
        await tx.courseEnrollment.create({
          data: {
            userId,
            orderId: order.id,
            courseId: course.id,
            courseTitle: course.title,
            priceNpr: course.priceNpr,
            status: 'PENDING_VERIFICATION',
          },
        });
      }


      await tx.auditLog.create({
        data: {
          userId,
          action: 'STUDENT_SUBMITTED_COURSE_PAYMENT',
          resourceType: 'Order',
          resourceId: order.id,
          payload: JSON.stringify({
            orderNumber,
            totalAmount,
            courses: selected.map((s) => s.title),
            hasScreenshot: true,
          }),
        },
      });

      return {
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmountNpr: totalAmount,
        enrolledCourses: selected.map((s) => s.title),
        status: 'PENDING_VERIFICATION',
        message:
          'Payment screenshot submitted successfully! Our administrative team will verify your receipt and grant full course access.',
      };
    });
  }

  async getEnrolledCourses(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            receiptImageUrl: true,
          },
        },
      },
    });

    return enrollments.map((e) => ({
      id: e.id,
      courseTitle: e.courseTitle,
      priceNpr: Number(e.priceNpr),
      status: e.status,
      verifiedAt: e.verifiedAt?.toISOString() || null,
      orderNumber: e.order?.orderNumber || null,
      orderStatus: e.order?.status || null,
      createdAt: e.createdAt.toISOString(),
    }));
  }
}
