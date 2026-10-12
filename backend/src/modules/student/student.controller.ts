import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Student Dashboard')
@Controller('student')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get student dashboard stats, subscription status, and recent attempts',
  })
  @ApiResponse({ status: 200, description: 'Student dashboard aggregated metrics' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.studentService.getDashboardSummary(userId);
  }
}
