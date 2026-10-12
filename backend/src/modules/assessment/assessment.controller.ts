import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import { SaveResponseDto } from './dto/save-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Assessment Engine')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of available practice tests and mock exams' })
  @ApiResponse({ status: 200, description: 'List of assessments' })
  async getAvailable(@Query('subjectId') subjectId?: string) {
    return this.assessmentService.getAvailableAssessments(subjectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment overview by ID' })
  async getById(@Param('id') id: string) {
    return this.assessmentService.getAssessmentById(id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a new attempt (sanitized questions without answer keys)' })
  @ApiResponse({ status: 201, description: 'Attempt created and questions returned' })
  async startAttempt(@Param('id') assessmentId: string, @CurrentUser('id') userId: string) {
    return this.assessmentService.startAttempt(assessmentId, userId);
  }

  @Post('attempts/:attemptId/save-response')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synchronize answer response during an active attempt' })
  async saveResponse(
    @Param('attemptId') attemptId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: SaveResponseDto,
  ) {
    return this.assessmentService.saveResponse(attemptId, userId, dto);
  }

  @Post('attempts/:attemptId/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finalize and score the examination attempt' })
  @ApiResponse({ status: 200, description: 'Scorecard and detailed solutions' })
  async submitAttempt(@Param('attemptId') attemptId: string, @CurrentUser('id') userId: string) {
    return this.assessmentService.submitAttempt(attemptId, userId);
  }

  @Get('attempts/:attemptId/result')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve results and explanation review for a submitted attempt' })
  async getResult(@Param('attemptId') attemptId: string, @CurrentUser('id') userId: string) {
    return this.assessmentService.getAttemptResult(attemptId, userId);
  }
}
