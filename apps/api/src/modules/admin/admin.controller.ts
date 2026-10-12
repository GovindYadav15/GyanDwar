import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleType } from '@prisma/client';

@ApiTags('Admin Console')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Platform operational metrics and audit feed' })
  async getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('orders')
  @ApiOperation({ summary: 'List recent subscription orders and payment records' })
  async getOrders() {
    return this.adminService.getRecentOrders();
  }

  @Get('questions')
  @ApiOperation({ summary: 'Question bank inventory with options and explanations' })
  async getQuestions(@Query('take') take?: number, @Query('skip') skip?: number) {
    return this.adminService.getQuestions(take ? Number(take) : 50, skip ? Number(skip) : 0);
  }
}
