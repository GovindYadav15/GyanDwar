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
import {
  CreateCoursePayloadDto,
  UpdateCoursePayloadDto,
  CreateCourseChapterPayloadDto,
  UpdateChapterPayloadDto,
} from './dto/course.dto';

@ApiTags('Admin Console & Content Studio')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // -------------------------------------------------------------
  // Dynamic Courses Management
  // -------------------------------------------------------------
  @Get('courses')
  @ApiOperation({ summary: 'List all dynamic courses with chapters, resource count, and enrollments' })
  async getCourses() {
    return this.adminService.getCourses();
  }

  @Post('courses')
  @ApiOperation({ summary: 'Create a new course with title, description, price, and metadata' })
  async createCourse(@Body() dto: CreateCoursePayloadDto) {
    return this.adminService.createCourse(dto);
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get a single course with chapters and resources' })
  async getCourseById(@Param('id') id: string) {
    return this.adminService.getCourseById(id);
  }

  @Patch('courses/:id')
  @ApiOperation({ summary: 'Update course details, price, description, or status' })
  async updateCourse(@Param('id') id: string, @Body() dto: UpdateCoursePayloadDto) {
    return this.adminService.updateCourse(id, dto);
  }

  @Delete('courses/:id')
  @ApiOperation({ summary: 'Delete a course and all its chapters' })
  async deleteCourse(@Param('id') id: string) {
    return this.adminService.deleteCourse(id);
  }

  // -------------------------------------------------------------
  // Course Chapters & Questions
  // -------------------------------------------------------------
  @Post('courses/:courseId/chapters')
  @ApiOperation({ summary: 'Create a new chapter under a specific course' })
  async createCourseChapter(
    @Param('courseId') courseId: string,
    @Body() dto: CreateCourseChapterPayloadDto,
  ) {
    return this.adminService.createCourseChapter(courseId, dto);
  }

  @Get('courses/:courseId/chapters')
  @ApiOperation({ summary: 'List all chapters belonging to a specific course' })
  async getCourseChapters(@Param('courseId') courseId: string) {
    return this.adminService.getCourseChapters(courseId);
  }

  @Patch('chapters/:chapterId')
  @ApiOperation({ summary: 'Update chapter title, description, or preview state' })
  async updateChapter(
    @Param('chapterId') chapterId: string,
    @Body() dto: UpdateChapterPayloadDto,
  ) {
    return this.adminService.updateChapter(chapterId, dto);
  }

  @Delete('chapters/:chapterId')
  @ApiOperation({ summary: 'Delete a chapter and its attached resources and questions' })
  async deleteChapter(@Param('chapterId') chapterId: string) {
    return this.adminService.deleteChapter(chapterId);
  }

  @Get('chapters/:chapterId/questions')
  @ApiOperation({ summary: 'Get all MCQs under a chapter' })
  async getChapterQuestions(@Param('chapterId') chapterId: string) {
    return this.adminService.getChapterQuestions(chapterId);
  }

  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Delete a question from a chapter question pool' })
  async deleteQuestion(@Param('questionId') questionId: string) {
    return this.adminService.deleteQuestion(questionId);
  }

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
  // Student Roster & Course Access Verification
  // -------------------------------------------------------------
  @Get('students')
  @ApiOperation({ summary: 'List student candidates with course enrollments, verification status, and recent orders' })
  async getStudents() {
    return this.adminService.getStudentsList();
  }

  @Post('students/:userId/verify')
  @ApiOperation({ summary: 'Directly verify student pending course enrollments and grant access' })
  async verifyStudentCourses(@Param('userId') userId: string, @Req() req: Request) {
    const adminUserId = (req as any).user?.id;
    return this.adminService.verifyStudentCourseEnrollments(userId, adminUserId);
  }

  // -------------------------------------------------------------
  // Administrator Invitation Management
  // -------------------------------------------------------------
  @Post('invitations')
  @ApiOperation({ summary: 'Generate a secure cryptographic invitation link for a new administrator' })
  async createInvitation(@Body() body: { email: string }, @Req() req: Request) {
    const adminUserId = (req as any).user?.id;
    return this.adminService.createAdminInvitation(body.email, adminUserId);
  }

  @Get('invitations')
  @ApiOperation({ summary: 'List all administrator invitations with status' })
  async getInvitations() {
    return this.adminService.getAdminInvitations();
  }

  @Delete('invitations/:id')
  @ApiOperation({ summary: 'Revoke an administrator invitation' })
  async revokeInvitation(@Param('id') id: string, @Req() req: Request) {
    const adminUserId = (req as any).user?.id;
    return this.adminService.revokeAdminInvitation(id, adminUserId);
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
