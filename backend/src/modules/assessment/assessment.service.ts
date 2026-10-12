import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { SaveResponseDto } from './dto/save-response.dto';
import { ScoringEngine, AnswerItemInput } from './scoring.engine';
import { AttemptStatus } from '@prisma/client';

@Injectable()
export class AssessmentService {
  private readonly logger = new Logger(AssessmentService.name);

  constructor(private prisma: PrismaService) {}

  async getAvailableAssessments(subjectId?: string) {
    const whereClause: any = { isPublished: true };
    if (subjectId) {
      whereClause.subjectId = subjectId;
    }

    return this.prisma.assessment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true },
        },
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
      },
    });
  }

  async getAssessmentById(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }

  async startAttempt(assessmentId: string, userId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          orderBy: { displayOrder: 'asc' },
          include: {
            question: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!assessment || !assessment.isPublished) {
      throw new NotFoundException('Assessment not available');
    }

    // Check entitlement if not free
    if (!assessment.isFree) {
      const activeSub = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
          endDate: { gte: new Date() },
        },
      });

      if (!activeSub) {
        throw new ForbiddenException(
          'A valid premium subscription pass is required to take this assessment.',
        );
      }
    }

    // Server-authoritative timing calculation
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + assessment.durationMinutes * 60 * 1000);

    const attempt = await this.prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId,
        status: AttemptStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
        totalMarks: assessment.totalMarks,
      },
    });

    this.logger.log(`Assessment attempt created: ${attempt.id} for user ${userId}`);

    // Return sanitized question payload (strictly NO correct answers or explanations)
    const sanitizedQuestions = assessment.questions.map((aq) => ({
      id: aq.question.id,
      questionText: aq.question.questionText,
      richMediaUrl: aq.question.richMediaUrl,
      difficulty: aq.question.difficulty,
      marks: Number(aq.marks),
      negativeMarks: Number(aq.question.negativeMarks),
      options: aq.question.options.map((opt) => ({
        id: opt.id,
        optionLabel: opt.optionLabel,
        optionText: opt.optionText,
      })),
    }));

    return {
      attemptId: attempt.id,
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      type: assessment.type,
      durationMinutes: assessment.durationMinutes,
      totalMarks: Number(assessment.totalMarks),
      passMarks: Number(assessment.passMarks),
      startedAt: attempt.startedAt.toISOString(),
      expiresAt: attempt.expiresAt.toISOString(),
      questions: sanitizedQuestions,
      savedResponses: {},
      markedForReview: [],
    };
  }

  async saveResponse(attemptId: string, userId: string, dto: SaveResponseDto) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('Unauthorized attempt access');
    }

    if (attempt.status !== AttemptStatus.IN_PROGRESS) {
      throw new BadRequestException('Attempt is already submitted or closed');
    }

    // Check timer boundary (+ 30 seconds network grace period)
    const now = new Date();
    const graceCutoff = new Date(attempt.expiresAt.getTime() + 30 * 1000);
    if (now > graceCutoff) {
      await this.prisma.assessmentAttempt.update({
        where: { id: attemptId },
        data: { status: AttemptStatus.EXPIRED },
      });
      throw new BadRequestException('Assessment time limit has expired');
    }

    await this.prisma.attemptResponse.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId: dto.questionId,
        },
      },
      update: {
        selectedOptionId: dto.selectedOptionId || null,
        timeSpentSeconds: dto.timeSpentSeconds || 0,
        isMarkedForReview: dto.isMarkedForReview ?? false,
      },
      create: {
        attemptId,
        questionId: dto.questionId,
        selectedOptionId: dto.selectedOptionId || null,
        timeSpentSeconds: dto.timeSpentSeconds || 0,
        isMarkedForReview: dto.isMarkedForReview ?? false,
      },
    });

    return { success: true };
  }

  async submitAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            questions: {
              include: {
                question: {
                  include: { options: true },
                },
              },
            },
          },
        },
        responses: true,
      },
    });

    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('Unauthorized access');
    }

    if (attempt.status === AttemptStatus.SUBMITTED) {
      return this.getAttemptResult(attemptId, userId);
    }

    // Build items for ScoringEngine
    const responseMap = new Map(attempt.responses.map((r) => [r.questionId, r.selectedOptionId]));
    const timeMap = new Map(attempt.responses.map((r) => [r.questionId, r.timeSpentSeconds]));

    const answerInputs: AnswerItemInput[] = attempt.assessment.questions.map((aq) => {
      const q = aq.question;
      const correctOpt = q.options.find((o) => o.isCorrect);
      return {
        questionId: q.id,
        selectedOptionId: responseMap.get(q.id) || null,
        correctOptionId: correctOpt ? correctOpt.id : '',
        marks: Number(aq.marks),
        negativeMarks: Number(q.negativeMarks),
        timeSpentSeconds: timeMap.get(q.id) || 0,
      };
    });

    const evaluatedScore = ScoringEngine.evaluate(
      answerInputs,
      Number(attempt.assessment.totalMarks),
      Number(attempt.assessment.passMarks),
    );

    const now = new Date();

    // Persist scores inside a transaction
    await this.prisma.$transaction(async (tx) => {
      for (const item of evaluatedScore.items) {
        await tx.attemptResponse.upsert({
          where: {
            attemptId_questionId: {
              attemptId,
              questionId: item.questionId,
            },
          },
          update: {
            isCorrect: item.isCorrect,
            marksAwarded: item.marksAwarded,
            negativeMarksDeducted: item.negativeMarksDeducted,
          },
          create: {
            attemptId,
            questionId: item.questionId,
            selectedOptionId: item.selectedOptionId,
            isCorrect: item.isCorrect,
            marksAwarded: item.marksAwarded,
            negativeMarksDeducted: item.negativeMarksDeducted,
          },
        });
      }

      await tx.assessmentAttempt.update({
        where: { id: attemptId },
        data: {
          status: AttemptStatus.SUBMITTED,
          submittedAt: now,
          scoreObtained: evaluatedScore.totalScore,
          accuracyRate: evaluatedScore.accuracyRate,
        },
      });
    });

    this.logger.log(
      `Attempt ${attemptId} submitted: Score ${evaluatedScore.totalScore}/${evaluatedScore.totalMarks} (${evaluatedScore.accuracyRate}%)`,
    );

    return this.getAttemptResult(attemptId, userId);
  }

  async getAttemptResult(attemptId: string, userId: string) {
    const attempt = await this.prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            questions: {
              include: {
                question: {
                  include: { options: true },
                },
              },
            },
          },
        },
        responses: true,
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundException('Attempt not found');
    }

    const responseMap = new Map(attempt.responses.map((r) => [r.questionId, r]));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const reviewItems = attempt.assessment.questions.map((aq) => {
      const q = aq.question;
      const resp = responseMap.get(q.id);
      const correctOpt = q.options.find((o) => o.isCorrect);

      if (!resp || !resp.selectedOptionId) {
        unansweredCount++;
      } else if (resp.isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOptionId: resp?.selectedOptionId || null,
        correctOptionId: correctOpt?.id || '',
        isCorrect: resp?.isCorrect || false,
        marksAwarded: Number(resp?.marksAwarded || 0),
        negativeMarksDeducted: Number(resp?.negativeMarksDeducted || 0),
        explanation:
          q.explanationText || 'Detailed engineering solution provided in curriculum notes.',
        options: q.options.map((opt) => ({
          id: opt.id,
          optionLabel: opt.optionLabel,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })),
      };
    });

    const scoreObtained = Number(attempt.scoreObtained || 0);
    const totalMarks = Number(attempt.assessment.totalMarks);
    const passMarks = Number(attempt.assessment.passMarks);

    return {
      attemptId: attempt.id,
      assessmentTitle: attempt.assessment.title,
      status: attempt.status,
      startedAt: attempt.startedAt.toISOString(),
      submittedAt: attempt.submittedAt?.toISOString() || '',
      scoreObtained,
      totalMarks,
      passMarks,
      isPassed: scoreObtained >= passMarks,
      totalAnswered: correctCount + incorrectCount,
      totalCorrect: correctCount,
      totalIncorrect: incorrectCount,
      totalUnanswered: unansweredCount,
      accuracyRate: Number(attempt.accuracyRate || 0),
      negativeDeduction: Number(
        attempt.responses.reduce((sum, r) => sum + Number(r.negativeMarksDeducted), 0).toFixed(2),
      ),
      reviewItems,
    };
  }
}
