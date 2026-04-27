import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiStatusResponseDto } from './dto/api-status-response.dto';
import { HealthCheckResponseDto } from './dto/health-check-response.dto';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Get API status and info' })
  @ApiResponse({
    status: 200,
    description: 'API is running',
    type: ApiStatusResponseDto,
  })
  getHealth(): ApiStatusResponseDto {
    return {
      status: 'ok',
      message: 'Errand AI is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    type: HealthCheckResponseDto,
  })
  healthCheck(): HealthCheckResponseDto {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
