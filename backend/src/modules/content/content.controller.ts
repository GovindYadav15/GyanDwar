import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CategoryCode } from '@prisma/client';
import { Request } from 'express';

@ApiTags('Content Hierarchy & Learning Materials')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all published examination categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async getCategories() {
    return this.contentService.getCategories();
  }

  @Get('categories/:code')
  @ApiOperation({
    summary: 'Get full syllabus hierarchy tree for an exam category (NEC, LOK_SEWA, DIPLOMA)',
  })
  @ApiResponse({ status: 200, description: 'Category tree with faculties, subjects, and chapters' })
  async getCategoryTree(@Param('code') code: CategoryCode) {
    return this.contentService.getCategoryByCode(code);
  }

  @Get('tracks/:trackId/subjects')
  @ApiOperation({ summary: 'Get subjects and chapters under an exam track' })
  async getSubjectsByTrack(@Param('trackId') trackId: string) {
    return this.contentService.getSubjectsByTrack(trackId);
  }

  @Get('chapters/:chapterId')
  @ApiOperation({
    summary: 'Get chapter learning resources and notes (enforcing free/premium access)',
  })
  async getChapterDetails(@Param('chapterId') chapterId: string, @Req() req: Request) {
    const userId = (req as any).user?.id;
    return this.contentService.getChapterDetails(chapterId, userId);
  }
}
