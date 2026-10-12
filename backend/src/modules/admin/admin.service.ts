import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as crypto from 'crypto';
import {
  ResourceType,
  RoleType,
  SubscriptionStatus,
  OrderStatus,
  PaymentStatus,
  InvitationStatus,
  EnrollmentStatus,
} from '@prisma/client';
import { parseMcqsFromMarkdown } from './utils/mcq-parser.util';
import {
  AdminUserListItem,
  AdminOrderItem,
  AdminChapterDetail,
  CreateChapterResourceDto,
  CreateChapterNotesDto,
  BulkMcqImportResult,
} from '@examsathi/shared';
import {
  CreateCoursePayloadDto,
  UpdateCoursePayloadDto,
  CreateCourseChapterPayloadDto,
  UpdateChapterPayloadDto,
} from './dto/course.dto';

@Injectable()
export class AdminService {

  constructor(private prisma: PrismaService) {}

  // -------------------------------------------------------------
  // 1. Dashboard Metrics & Operational Overview
  // -------------------------------------------------------------
  async getMetrics() {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuestions,
      totalAssessments,
      totalChapters,
      totalOrders,
      paidOrders,
      pendingOrders,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.userRole.count({ where: { role: { name: RoleType.STUDENT } } }),
      this.prisma.userRole.count({
        where: {
          role: { name: { in: [RoleType.ADMIN, RoleType.SUPER_ADMIN, RoleType.INSTRUCTOR] } },
        },
      }),
      this.prisma.question.count(),
      this.prisma.assessment.count(),
      this.prisma.chapter.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PAID' } }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, fullName: true } } },
      }),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalAdmins,
      totalQuestions,
      totalAssessments,
      totalChapters,
      totalOrders,
      paidOrders,
      pendingOrders,
      conversionRate: totalOrders > 0 ? Number(((paidOrders / totalOrders) * 100).toFixed(1)) : 0,
      recentAuditLogs,
    };
  }

  // -------------------------------------------------------------
  // 1b. Dynamic Course Administration
  // -------------------------------------------------------------
  async createCourse(dto: CreateCoursePayloadDto) {
    const course = await this.prisma.course.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        priceNpr: dto.priceNpr,
        originalPriceNpr: dto.originalPriceNpr !== undefined ? dto.originalPriceNpr : null,
        categoryCode: dto.categoryCode ?? null,
        faculty: dto.faculty ?? null,
        duration: dto.duration ?? null,
        badge: dto.badge ?? null,
        features: dto.features && dto.features.length > 0 ? JSON.stringify(dto.features) : null,
        isPublished: dto.isPublished ?? true,
      },
    });

    return {
      ...course,
      priceNpr: Number(course.priceNpr),
      originalPriceNpr: course.originalPriceNpr ? Number(course.originalPriceNpr) : null,
      features: course.features ? JSON.parse(course.features) : [],
    };
  }

  async getCourses() {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          include: {
            resources: true,
            _count: { select: { questions: true } },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      priceNpr: Number(c.priceNpr),
      originalPriceNpr: c.originalPriceNpr ? Number(c.originalPriceNpr) : null,
      categoryCode: c.categoryCode,
      faculty: c.faculty,
      duration: c.duration,
      badge: c.badge,
      features: c.features ? JSON.parse(c.features) : [],
      isPublished: c.isPublished,
      displayOrder: c.displayOrder,
      chapterCount: c.chapters.length,
      enrollmentsCount: c._count.enrollments,
      chapters: c.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        chapterNumber: ch.chapterNumber,
        description: ch.description,
        isFreePreview: ch.isFreePreview,
        resourceCount: ch.resources.length,
        pdfCount: ch.resources.filter((r) => r.resourceType === ResourceType.PDF).length,
        questionCount: ch._count.questions,
        resources: ch.resources.map((r) => ({
          id: r.id,
          title: r.title,
          resourceType: r.resourceType,
          fileUrl: r.fileUrl,
          fileSizeBytes: r.fileSizeBytes,
          isFreePreview: r.isFreePreview,
        })),
      })),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          include: {
            resources: { orderBy: { displayOrder: 'asc' } },
            questions: {
              include: { options: true },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return {
      ...course,
      priceNpr: Number(course.priceNpr),
      originalPriceNpr: course.originalPriceNpr ? Number(course.originalPriceNpr) : null,
      features: course.features ? JSON.parse(course.features) : [],
      chapters: course.chapters.map((ch) => ({
        id: ch.id,
        title: ch.title,
        chapterNumber: ch.chapterNumber,
        description: ch.description,
        isFreePreview: ch.isFreePreview,
        resources: ch.resources,
        questionCount: ch.questions.length,
        questions: ch.questions,
      })),
    };
  }

  async updateCourse(courseId: string, dto: UpdateCoursePayloadDto) {
    const existing = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const updated = await this.prisma.course.update({
      where: { id: courseId },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description.trim() }),
        ...(dto.priceNpr !== undefined && { priceNpr: dto.priceNpr }),
        ...(dto.originalPriceNpr !== undefined && { originalPriceNpr: dto.originalPriceNpr }),
        ...(dto.categoryCode !== undefined && { categoryCode: dto.categoryCode }),
        ...(dto.faculty !== undefined && { faculty: dto.faculty }),
        ...(dto.duration !== undefined && { duration: dto.duration }),
        ...(dto.badge !== undefined && { badge: dto.badge }),
        ...(dto.features !== undefined && { features: JSON.stringify(dto.features) }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
      },
    });

    return {
      ...updated,
      priceNpr: Number(updated.priceNpr),
      originalPriceNpr: updated.originalPriceNpr ? Number(updated.originalPriceNpr) : null,
      features: updated.features ? JSON.parse(updated.features) : [],
    };
  }

  async deleteCourse(courseId: string) {
    const existing = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!existing) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return this.prisma.course.delete({ where: { id: courseId } });
  }

  // -------------------------------------------------------------
  // Course Chapter Management
  // -------------------------------------------------------------
  async createCourseChapter(courseId: string, dto: CreateCourseChapterPayloadDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const chapter = await this.prisma.chapter.create({
      data: {
        courseId,
        title: dto.title.trim(),
        chapterNumber: dto.chapterNumber,
        description: dto.description ? dto.description.trim() : null,
        isFreePreview: dto.isFreePreview ?? false,
      },
      include: {
        resources: true,
      },
    });

    return chapter;
  }

  async getCourseChapters(courseId: string) {
    const chapters = await this.prisma.chapter.findMany({
      where: { courseId },
      orderBy: { chapterNumber: 'asc' },
      include: {
        resources: { orderBy: { displayOrder: 'asc' } },
        _count: { select: { questions: true } },
      },
    });

    return chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      chapterNumber: ch.chapterNumber,
      description: ch.description,
      isFreePreview: ch.isFreePreview,
      questionCount: ch._count.questions,
      resources: ch.resources,
    }));
  }

  async updateChapter(chapterId: string, dto: UpdateChapterPayloadDto) {
    const existing = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!existing) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    return this.prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.chapterNumber !== undefined && { chapterNumber: dto.chapterNumber }),
        ...(dto.description !== undefined && { description: dto.description.trim() }),
        ...(dto.isFreePreview !== undefined && { isFreePreview: dto.isFreePreview }),
      },
    });
  }

  async deleteChapter(chapterId: string) {
    const existing = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!existing) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    return this.prisma.chapter.delete({ where: { id: chapterId } });
  }

  async getChapterQuestions(chapterId: string) {
    const chapter = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    return this.prisma.question.findMany({
      where: { chapterId },
      orderBy: { createdAt: 'desc' },
      include: {
        options: { orderBy: { optionLabel: 'asc' } },
      },
    });
  }

  async deleteQuestion(questionId: string) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    return this.prisma.question.delete({ where: { id: questionId } });
  }

  // -------------------------------------------------------------
  // 2. Chapters, Notes & Multi-PDF Sub-Chapters
  // -------------------------------------------------------------
  async getChaptersHierarchy(): Promise<AdminChapterDetail[]> {
    const chapters = await this.prisma.chapter.findMany({
      where: { subjectId: { not: null } },
      orderBy: [
        { chapterNumber: 'asc' },
      ],
      include: {
        subject: {

          include: {
            examTrack: {
              include: {
                faculty: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        resources: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { questions: true },
        },
      },
    });

    return chapters.map((c) => ({
      id: c.id,
      subjectId: c.subjectId,
      subjectName: c.subject.name,
      subjectCode: c.subject.code,
      categoryCode: c.subject.examTrack.faculty.category.code,
      title: c.title,
      chapterNumber: c.chapterNumber,
      description: c.description,
      isFreePreview: c.isFreePreview,
      displayOrder: c.displayOrder,
      resources: c.resources.map((r) => ({
        id: r.id,
        chapterId: r.chapterId,
        title: r.title,
        resourceType: r.resourceType as any,
        content: r.content,
        fileUrl: r.fileUrl,
        fileSizeBytes: r.fileSizeBytes,
        isFreePreview: r.isFreePreview,
      })),
      questionCount: c._count.questions,
    }));
  }

  async addChapterNotes(chapterId: string, dto: CreateChapterNotesDto) {
    const chapter = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    // Check if a primary NOTES resource already exists, update or create
    const existingNotes = await this.prisma.learningResource.findFirst({
      where: { chapterId, resourceType: ResourceType.NOTES },
    });

    if (existingNotes) {
      return this.prisma.learningResource.update({
        where: { id: existingNotes.id },
        data: {
          title: dto.title || existingNotes.title,
          content: dto.content,
          isFreePreview: dto.isFreePreview ?? existingNotes.isFreePreview,
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.learningResource.create({
      data: {
        chapterId,
        title: dto.title || `${chapter.title} Comprehensive Notes`,
        resourceType: ResourceType.NOTES,
        content: dto.content,
        isFreePreview: dto.isFreePreview ?? false,
        displayOrder: 0,
      },
    });
  }

  async addChapterResource(chapterId: string, dto: CreateChapterResourceDto) {
    const chapter = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    const currentCount = await this.prisma.learningResource.count({ where: { chapterId } });

    return this.prisma.learningResource.create({
      data: {
        chapterId,
        title: dto.title,
        resourceType: (dto.resourceType as ResourceType) || ResourceType.PDF,
        content: dto.content || null,
        fileUrl: dto.fileUrl || null,
        fileSizeBytes: dto.fileSizeBytes || null,
        isFreePreview: dto.isFreePreview ?? false,
        displayOrder: dto.displayOrder ?? currentCount + 1,
      },
    });
  }

  async deleteChapterResource(resourceId: string) {
    const resource = await this.prisma.learningResource.findUnique({ where: { id: resourceId } });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    return this.prisma.learningResource.delete({ where: { id: resourceId } });
  }

  // -------------------------------------------------------------
  // 3. Bulk MCQ Markdown Ingestion
  // -------------------------------------------------------------
  async importMcqsFromMarkdown(
    chapterId: string,
    markdownContent: string,
  ): Promise<BulkMcqImportResult> {
    const chapter = await this.prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${chapterId} not found`);
    }

    const { questions: parsedItems, errors } = parseMcqsFromMarkdown(markdownContent);

    if (parsedItems.length === 0) {
      throw new BadRequestException({
        message: 'No valid questions could be parsed from markdown.',
        errors,
      });
    }

    // Save questions in transaction
    const createdQuestions = await this.prisma.$transaction(async (tx) => {
      const results: { id: string; questionText: string }[] = [];

      for (const item of parsedItems) {
        const question = await tx.question.create({
          data: {
            chapterId,
            questionText: item.questionText,
            difficulty: item.difficulty as any,
            marks: item.marks,
            negativeMarks: item.negativeMarks,
            explanationText: item.explanationText || null,
            options: {
              create: item.options.map((opt) => ({
                optionLabel: opt.optionLabel,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
              })),
            },
          },
          select: { id: true, questionText: true },
        });
        results.push(question);
      }

      return results;
    });

    return {
      totalParsed: parsedItems.length,
      createdCount: createdQuestions.length,
      questions: createdQuestions,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  // -------------------------------------------------------------
  // 4. User Directory (Students vs Admin Categories)
  // -------------------------------------------------------------
  async getUsers(
    roleCategory?: 'STUDENT' | 'ADMIN_STAFF' | 'ALL',
    search?: string,
  ): Promise<AdminUserListItem[]> {
    const whereClause: any = {};

    if (search && search.trim()) {
      const query = search.trim();
      whereClause.OR = [
        { fullName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { phoneNumber: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (roleCategory === 'STUDENT') {
      whereClause.userRoles = {
        some: {
          role: { name: RoleType.STUDENT },
        },
        none: {
          role: { name: { in: [RoleType.ADMIN, RoleType.SUPER_ADMIN, RoleType.INSTRUCTOR] } },
        },
      };
    } else if (roleCategory === 'ADMIN_STAFF') {
      whereClause.userRoles = {
        some: {
          role: {
            name: {
              in: [
                RoleType.ADMIN,
                RoleType.SUPER_ADMIN,
                RoleType.INSTRUCTOR,
                RoleType.CONTENT_EDITOR,
              ],
            },
          },
        },
      };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      take: 100,
      orderBy: { createdAt: 'desc' },
      include: {
        userRoles: {
          include: { role: true },
        },
        subscriptions: {
          where: { status: SubscriptionStatus.ACTIVE, endDate: { gte: new Date() } },
          include: { plan: true },
          take: 1,
        },
      },
    });

    return users.map((u) => {
      const roles = u.userRoles.map((ur) => ur.role.name as any);
      const isStaff = roles.some((r: any) =>
        [
          RoleType.ADMIN,
          RoleType.SUPER_ADMIN,
          RoleType.INSTRUCTOR,
          RoleType.CONTENT_EDITOR,
        ].includes(r),
      );

      return {
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
        roles,
        isActive: u.isActive,
        userType: isStaff ? 'ADMIN_STAFF' : 'STUDENT',
        activeSubscription: u.subscriptions[0]?.plan?.name || null,
        createdAt: u.createdAt.toISOString(),
      };
    });
  }

  async updateUserRole(userId: string, roleName: RoleType) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) throw new NotFoundException(`Role ${roleName} not found`);

    // Ensure user has this role
    await this.prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId: role.id } },
      update: {},
      create: { userId, roleId: role.id },
    });

    return { success: true, message: `Role ${roleName} assigned to user.` };
  }

  async updateUserStatus(userId: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  // -------------------------------------------------------------
  // 5. Orders & Course Access Verification by Admin
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 5. Orders & Course Access Verification by Admin
  // -------------------------------------------------------------
  async getOrders(statusFilter?: OrderStatus) {
    const where: any = {};
    if (statusFilter) {
      where.status = statusFilter;
    }

    const orders = await this.prisma.order.findMany({
      where,
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            subscriptions: {
              where: { status: SubscriptionStatus.ACTIVE, endDate: { gte: new Date() } },
            },
          },
        },
        plan: true,
        enrollments: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return orders.map((o) => {
      const latestPayment = o.payments[0];
      const courseTitles = o.enrollments.map((e) => e.courseTitle).join(', ');
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        userId: o.userId,
        userFullName: o.user.fullName,
        userEmail: o.user.email,
        userPhone: o.user.phoneNumber,
        planId: o.planId,
        planName: o.plan?.name || (courseTitles ? `Courses: ${courseTitles}` : 'Preparation Pass'),
        durationDays: o.plan?.durationDays || 365,
        amountNpr: Number(o.amountNpr),
        status: o.status,
        receiptImageUrl: o.receiptImageUrl || null,
        transactionCode: o.transactionCode || null,
        paymentRemarks: o.paymentRemarks || null,
        verificationNotes: o.verificationNotes || null,
        enrolledCourses: o.enrollments.map((e) => ({
          id: e.id,
          title: e.courseTitle,
          status: e.status,
          priceNpr: Number(e.priceNpr),
        })),
        paymentGateway: (latestPayment?.gateway as any) || (o.receiptImageUrl ? 'ESEWA_OFFLINE_SCREENSHOT' : null),
        gatewayTransactionId: latestPayment?.gatewayTransactionId || o.transactionCode || null,
        paymentStatus: (latestPayment?.status as any) || (o.status === 'PAID' ? 'SUCCESS' : 'PENDING'),
        createdAt: o.createdAt.toISOString(),
        hasActiveSubscription: o.user.subscriptions.length > 0,
      };
    });
  }

  /**
   * Admin explicitly verifies a payment and activates the user's subscription course access.
   */
  async verifyOrderPayment(orderId: string, adminUserId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { plan: true, user: true, payments: true, enrollments: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const durationDays = order.plan?.durationDays || 365;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      // 1. Mark Order as PAID and record verification metadata
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.PAID,
          verifiedById: adminUserId || null,
          verifiedAt: new Date(),
        },
      });

      // 2. Mark payments as SUCCESS
      if (order.payments.length > 0) {
        await tx.payment.updateMany({
          where: { orderId },
          data: { status: PaymentStatus.SUCCESS },
        });
      } else {
        await tx.payment.create({
          data: {
            orderId,
            gateway: 'ESEWA',
            gatewayTransactionId: order.transactionCode || `ADMIN_VERIFIED_${Date.now()}`,
            amountNpr: order.amountNpr,
            status: PaymentStatus.SUCCESS,
            rawResponse: JSON.stringify({
              verifiedBy: adminUserId || 'ADMIN',
              verifiedAt: new Date(),
              receiptImageUrl: order.receiptImageUrl,
            }),
          },
        });
      }

      // 3. Activate all course enrollments tied to this order
      if (order.enrollments.length > 0) {
        await tx.courseEnrollment.updateMany({
          where: { orderId },
          data: {
            status: EnrollmentStatus.ACTIVE,
            verifiedAt: new Date(),
            verifiedById: adminUserId || null,
            expiresAt: endDate,
          },
        });
      }

      // 4. Create or activate Subscription granting access to courses/materials
      let planIdToUse = order.planId;
      if (!planIdToUse) {
        const defaultPlan = await tx.subscriptionPlan.findFirst();
        planIdToUse = defaultPlan?.id || null;
      }

      let subscriptionId: string | null = null;
      if (planIdToUse) {
        const subscription = await tx.subscription.create({
          data: {
            userId: order.userId,
            planId: planIdToUse,
            status: SubscriptionStatus.ACTIVE,
            startDate,
            endDate,
          },
        });
        subscriptionId = subscription.id;
      }

      // 5. Write AuditLog
      await tx.auditLog.create({
        data: {
          userId: adminUserId || null,
          action: 'ADMIN_VERIFIED_PAYMENT',
          resourceType: 'ORDER',
          resourceId: order.id,
          payload: JSON.stringify({
            orderNumber: order.orderNumber,
            amountNpr: Number(order.amountNpr),
            enrolledCourses: order.enrollments.map((e) => e.courseTitle),
            grantedAccessDays: durationDays,
            subscriptionId,
          }),
        },
      });

      return {
        success: true,
        orderId: order.id,
        subscriptionId,
        message: `Order #${order.orderNumber} successfully verified. Active course access granted until ${endDate.toISOString().split('T')[0]}.`,
      };
    });
  }

  async rejectOrderPayment(
    orderId: string,
    reason = 'Payment verification declined by administrator.',
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { enrollments: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
          verificationNotes: reason,
        },
      });

      await tx.payment.updateMany({
        where: { orderId },
        data: { status: PaymentStatus.FAILED },
      });

      if (order.enrollments.length > 0) {
        await tx.courseEnrollment.updateMany({
          where: { orderId },
          data: { status: EnrollmentStatus.REVOKED },
        });
      }

      await tx.auditLog.create({
        data: {
          action: 'ADMIN_REJECTED_PAYMENT',
          resourceType: 'ORDER',
          resourceId: order.id,
          payload: JSON.stringify({ reason }),
        },
      });
    });

    return { success: true, message: `Order #${order.orderNumber} marked as rejected.` };
  }

  // -------------------------------------------------------------
  // 6. Student Course Verification Management
  // -------------------------------------------------------------
  async getStudentsList() {
    const students = await this.prisma.user.findMany({
      where: {
        userRoles: {
          some: { role: { name: RoleType.STUDENT } },
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        courseEnrollments: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        subscriptions: {
          where: { status: SubscriptionStatus.ACTIVE, endDate: { gte: new Date() } },
        },
      },
    });

    return students.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      phoneNumber: s.phoneNumber,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      activeSubscriptionsCount: s.subscriptions.length,
      hasPendingVerifications: s.courseEnrollments.some(
        (e) => e.status === EnrollmentStatus.PENDING_VERIFICATION,
      ),
      enrollments: s.courseEnrollments.map((e) => ({
        id: e.id,
        courseTitle: e.courseTitle,
        priceNpr: Number(e.priceNpr),
        status: e.status,
        verifiedAt: e.verifiedAt?.toISOString() || null,
      })),
      orders: s.orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        amountNpr: Number(o.amountNpr),
        status: o.status,
        receiptImageUrl: o.receiptImageUrl || null,
        transactionCode: o.transactionCode || null,
        createdAt: o.createdAt.toISOString(),
      })),
    }));
  }

  async verifyStudentCourseEnrollments(userId: string, adminUserId?: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        courseEnrollments: {
          where: { status: EnrollmentStatus.PENDING_VERIFICATION },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student user not found');
    }

    const verifiedAt = new Date();
    const endDate = new Date(verifiedAt.getTime() + 365 * 24 * 60 * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      await tx.courseEnrollment.updateMany({
        where: { userId, status: EnrollmentStatus.PENDING_VERIFICATION },
        data: {
          status: EnrollmentStatus.ACTIVE,
          verifiedAt,
          verifiedById: adminUserId || null,
          expiresAt: endDate,
        },
      });

      // Ensure active subscription is present
      const defaultPlan = await tx.subscriptionPlan.findFirst();
      if (defaultPlan) {
        await tx.subscription.create({
          data: {
            userId,
            planId: defaultPlan.id,
            status: SubscriptionStatus.ACTIVE,
            startDate: verifiedAt,
            endDate,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: adminUserId || null,
          action: 'ADMIN_VERIFIED_STUDENT_COURSE_ACCESS',
          resourceType: 'User',
          resourceId: userId,
          payload: JSON.stringify({
            studentEmail: student.email,
            verifiedCourses: student.courseEnrollments.map((e) => e.courseTitle),
          }),
        },
      });

      return {
        success: true,
        message: `Course access verified and granted for student ${student.fullName}.`,
      };
    });
  }

  // -------------------------------------------------------------
  // 7. Administrator Invitation Management
  // -------------------------------------------------------------
  async createAdminInvitation(email: string, adminUserId: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await this.prisma.user.findFirst({
      where: {
        email: normalizedEmail,
        userRoles: {
          some: { role: { name: { in: [RoleType.ADMIN, RoleType.SUPER_ADMIN] } } },
        },
      },
    });
    if (existingAdmin) {
      throw new BadRequestException('A user with this email address is already an administrator');
    }

    const existingPending = await this.prisma.adminInvitation.findFirst({
      where: {
        email: normalizedEmail,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });
    if (existingPending) {
      throw new BadRequestException('An active administrator invitation is already pending for this email');
    }

    // Cryptographically secure token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await this.prisma.adminInvitation.create({
      data: {
        email: normalizedEmail,
        tokenHash,
        status: InvitationStatus.PENDING,
        invitedById: adminUserId,
        expiresAt,
      },
      include: {
        invitedBy: {
          select: { fullName: true, email: true },
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'ADMIN_INVITATION_CREATED',
        resourceType: 'AdminInvitation',
        resourceId: invitation.id,
        payload: JSON.stringify({ email: normalizedEmail, expiresAt }),
      },
    });

    return {
      id: invitation.id,
      email: invitation.email,
      status: invitation.status,
      expiresAt: invitation.expiresAt.toISOString(),
      invitationToken: rawToken,
      invitationUrl: `http://localhost:3000/admin/invitations/accept?token=${rawToken}`,
      message: 'Administrator invitation generated successfully.',
    };
  }

  async getAdminInvitations() {
    const invitations = await this.prisma.adminInvitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitedBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      status: inv.status,
      invitedBy: inv.invitedBy.fullName,
      invitedByEmail: inv.invitedBy.email,
      expiresAt: inv.expiresAt.toISOString(),
      acceptedAt: inv.acceptedAt?.toISOString() || null,
      createdAt: inv.createdAt.toISOString(),
    }));
  }

  async revokeAdminInvitation(invitationId: string, adminUserId: string) {
    const invitation = await this.prisma.adminInvitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    await this.prisma.adminInvitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.REVOKED },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'ADMIN_INVITATION_REVOKED',
        resourceType: 'AdminInvitation',
        resourceId: invitationId,
        payload: JSON.stringify({ email: invitation.email }),
      },
    });

    return { success: true, message: 'Invitation revoked successfully.' };
  }

  // -------------------------------------------------------------
  // 8. Question Inventory
  // -------------------------------------------------------------
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

