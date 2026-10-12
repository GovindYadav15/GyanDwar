import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.examCategory.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { faculties: true },
        },
      },
    });
  }

  async getCategoryByCode(code: any) {
    const category = await this.prisma.examCategory.findUnique({
      where: { code },
      include: {
        faculties: {
          orderBy: { displayOrder: 'asc' },
          include: {
            examTracks: {
              include: {
                subjects: {
                  include: {
                    chapters: {
                      orderBy: { chapterNumber: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Exam category ${code} not found`);
    }

    return category;
  }

  async getSubjectsByTrack(examTrackId: string) {
    return this.prisma.subject.findMany({
      where: { examTrackId },
      orderBy: { displayOrder: 'asc' },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          include: {
            _count: {
              select: { questions: true, resources: true },
            },
          },
        },
      },
    });
  }

  async getChapterDetails(chapterId: string, userId?: string) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        subject: {
          include: {
            examTrack: {
              include: {
                faculty: {
                  include: { category: true },
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

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    if (!chapter.isFreePreview) {
      if (!userId) {
        return {
          ...chapter,
          isLocked: true,
          resources: chapter.resources.map((r) => ({
            id: r.id,
            title: r.title,
            resourceType: r.resourceType,
            isFreePreview: r.isFreePreview,
            content: r.isFreePreview ? r.content : null,
          })),
        };
      }

      const activeSub = await this.prisma.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
          endDate: { gte: new Date() },
          plan: {
            entitlements: {
              some: {
                categoryId: chapter.subject.examTrack.faculty.categoryId,
                canAccessNotes: true,
              },
            },
          },
        },
      });

      if (!activeSub) {
        return {
          ...chapter,
          isLocked: true,
          resources: chapter.resources.map((r) => ({
            id: r.id,
            title: r.title,
            resourceType: r.resourceType,
            isFreePreview: r.isFreePreview,
            content: r.isFreePreview ? r.content : null,
          })),
        };
      }
    }

    return {
      ...chapter,
      isLocked: false,
    };
  }
}
