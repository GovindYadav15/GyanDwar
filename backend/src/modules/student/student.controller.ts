import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCourseOrderDto } from './dto/course-order.dto';

@ApiTags('Student Dashboard & Course Orders')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get student dashboard stats, subscription status, and recent attempts',
  })
  @ApiResponse({ status: 200, description: 'Student dashboard aggregated metrics' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.studentService.getDashboardSummary(userId);
  }

  @Get('available-courses')
  @ApiOperation({ summary: 'List all available courses for enrollment with pricing and features' })
  async getAvailableCourses() {
    return this.studentService.getAvailableCourses();
  }

  @Post('course-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit a multi-course order with offline eSewa transfer receipt screenshot for admin verification',
  })
  @ApiResponse({ status: 201, description: 'Course order created and awaiting admin verification' })
  async createCourseOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCourseOrderDto,
  ) {
    return this.studentService.createCourseOrder(userId, dto);
  }

  @Get('enrolled-courses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of student enrolled courses and verification statuses' })
  async getEnrolledCourses(@CurrentUser('id') userId: string) {
    return this.studentService.getEnrolledCourses(userId);
  }
}
