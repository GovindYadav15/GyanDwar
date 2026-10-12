import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleType, OrderStatus } from '@prisma/client';
import { Request } from 'express';
import {
  CreateChapterResourceDto,
  CreateChapterNotesDto,
  BulkMcqImportDto,
} from '@examsathi/shared';

@ApiTags('Admin Console & Content Studio')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // -------------------------------------------------------------
  // Operational Metrics
  // -------------------------------------------------------------
  @Get('metrics')
  @ApiOperation({ summary: 'Platform operational metrics, users breakdown, and audit feed' })
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  // -------------------------------------------------------------
  // Content Management: Chapters, Notes & Sub-Chapters (Multi-PDF)
  // -------------------------------------------------------------
  @Get('chapters')
  @ApiOperation({
    summary: 'List all chapters with subjects, tracks, and existing resource counts',
  })
  async getChapters() {
    return this.adminService.getChaptersHierarchy();
  }

  @Post('chapters/:chapterId/notes')
  @ApiOperation({ summary: 'Create or update detailed notes for a specific chapter' })
  async addChapterNotes(@Param('chapterId') chapterId: string, @Body() dto: CreateChapterNotesDto) {
    return this.adminService.addChapterNotes(chapterId, dto);
  }

  @Post('chapters/:chapterId/resources')
  @ApiOperation({ summary: 'Create a sub-chapter or attach a PDF resource to a chapter' })
  async addChapterResource(
    @Param('chapterId') chapterId: string,
    @Body() dto: CreateChapterResourceDto,
  ) {
    return this.adminService.addChapterResource(chapterId, dto);
  }

  @Delete('resources/:resourceId')
  @ApiOperation({ summary: 'Delete a learning resource or sub-chapter PDF' })
  async deleteChapterResource(@Param('resourceId') resourceId: string) {
    return this.adminService.deleteChapterResource(resourceId);
  }

  // -------------------------------------------------------------
  // Bulk MCQ Markdown Ingestion
  // -------------------------------------------------------------
  @Post('chapters/:chapterId/mcqs/markdown')
  @ApiOperation({
    summary: 'Parse and import multiple MCQs from markdown text with 4 options and answer keys',
  })
  async importMcqsFromMarkdown(
    @Param('chapterId') chapterId: string,
    @Body() dto: { markdownContent: string },
  ) {
    return this.adminService.importMcqsFromMarkdown(chapterId, dto.markdownContent);
  }

  // -------------------------------------------------------------
  // User Management (Students vs Admin Categories)
  // -------------------------------------------------------------
  @Get('users')
  @ApiOperation({ summary: 'List users segregated by Student vs Admin categories' })
  @ApiQuery({ name: 'category', required: false, enum: ['STUDENT', 'ADMIN_STAFF', 'ALL'] })
  @ApiQuery({ name: 'search', required: false })
  async getUsers(
    @Query('category') category?: 'STUDENT' | 'ADMIN_STAFF' | 'ALL',
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(category, search);
  }

  @Patch('users/:userId/role')
  @ApiOperation({ summary: 'Assign a role (STUDENT, ADMIN, INSTRUCTOR) to a user' })
  async updateUserRole(@Param('userId') userId: string, @Body() body: { role: RoleType }) {
    return this.adminService.updateUserRole(userId, body.role);
  }

  @Patch('users/:userId/status')
  @ApiOperation({ summary: 'Toggle user active/suspended status' })
  async updateUserStatus(@Param('userId') userId: string, @Body() body: { isActive: boolean }) {
    return this.adminService.updateUserStatus(userId, body.isActive);
  }

  // -------------------------------------------------------------
  // Order & Payment Verification (Admin Course Access Approval)
  // -------------------------------------------------------------
  @Get('orders')
  @ApiOperation({ summary: 'List student subscription orders and payment records' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  async getOrders(@Query('status') status?: OrderStatus) {
    return this.adminService.getOrders(status);
  }

  @Post('orders/:orderId/verify')
  @ApiOperation({
    summary: 'Admin verifies student payment and activates course subscription access',
  })
  async verifyOrderPayment(@Param('orderId') orderId: string, @Req() req: Request) {
    const adminUserId = (req as any).user?.id;
    return this.adminService.verifyOrderPayment(orderId, adminUserId);
  }

  @Post('orders/:orderId/reject')
  @ApiOperation({ summary: 'Admin rejects an order payment' })
  async rejectOrderPayment(@Param('orderId') orderId: string, @Body() body: { reason?: string }) {
    return this.adminService.rejectOrderPayment(orderId, body.reason);
  }

  // -------------------------------------------------------------
  // Question Bank Inventory
  // -------------------------------------------------------------
  @Get('questions')
  @ApiOperation({ summary: 'Question bank inventory with options and explanations' })
  async getQuestions(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.adminService.getQuestions(take ? Number(take) : 50, skip ? Number(skip) : 0);
  }
}
