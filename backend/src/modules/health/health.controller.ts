import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Health & Observability')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness check for container orchestrators' })
  getLiveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness check ensuring database connectivity' })
  async getReadiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        status: 'not_ready',
        database: 'disconnected',
        error: err.message,
      };
    }
  }
}
