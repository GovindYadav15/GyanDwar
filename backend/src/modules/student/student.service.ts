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
    return [
      {
        id: 'course-nec-civil',
        title: 'Nepal Engineering Council (NEC) - Civil License Complete Track',
        categoryCode: 'NEC',
        faculty: 'Civil Engineering',
        badge: 'High Demand',
        rating: 4.9,
        reviewsCount: 320,
        originalPriceNpr: 2999,
        priceNpr: 1999,
        duration: '120+ Study Hours',
        totalMocks: 15,
        features: [
          'Full Syllabus NEC Civil Engineering',
          'Unlimited 100-Mark Model Mock Exams (Negative Marking 20%)',
          'Downloadable Chapter Formula PDFs & Notes',
          'Instant Scoring & Performance Weakness Analysis',
        ],
      },
      {
        id: 'course-loksewa-civil-7',
        title: 'Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation',
        categoryCode: 'LOK_SEWA',
        faculty: 'Civil Engineering',
        badge: 'Best Seller',
        rating: 4.95,
        reviewsCount: 512,
        originalPriceNpr: 3999,
        priceNpr: 2499,
        duration: '180+ Study Hours',
        totalMocks: 25,
        features: [
          'Federal & Provincial Lok Sewa Syllabus',
          'Technical Objective MCQ Question Bank (3,000+ Questions)',
          'Previous Year Solved Papers & Rationale Explanations',
          'Dedicated Subject-wise Drill Tests',
        ],
      },
      {
        id: 'course-loksewa-subeng-5',
        title: 'Lok Sewa Aayog: Sub-Engineer (5th Level) Exam Booster',
        categoryCode: 'LOK_SEWA',
        faculty: 'Civil Engineering',
        badge: 'Popular',
        rating: 4.85,
        reviewsCount: 280,
        originalPriceNpr: 2499,
        priceNpr: 1799,
        duration: '100+ Study Hours',
        totalMocks: 12,
        features: [
          'Assistant Level 5 Lok Sewa Curriculum',
          'Chapter Notes, Pozzolana, Concrete & Surveying',
          'Timed Exam Simulator with Answer Keys',
        ],
      },
      {
        id: 'course-diploma-civil',
        title: 'Diploma Engineering Licensing Examination (Civil)',
        categoryCode: 'DIPLOMA',
        faculty: 'Diploma Engineering',
        badge: 'New Syllabus',
        rating: 4.8,
        reviewsCount: 195,
        originalPriceNpr: 1999,
        priceNpr: 1499,
        duration: '90+ Study Hours',
        totalMocks: 10,
        features: [
          'CTEVT / Diploma Board Licensing Standards',
          'Core Subject Summaries & MCQ Tests',
          'Verified Passing Blueprint',
        ],
      },
    ];
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
