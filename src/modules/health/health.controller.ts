import { Controller, Get, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @Version('1')
  @ResponseMessage('OK')
  @ApiOperation({ summary: 'Return service health status' })
  @ApiOkResponse({
    description: 'Health status response',
    schema: {
      example: {
        success: true,
        message: 'OK',
        data: {
          status: 'ok',
          timestamp: '2026-04-18T15:00:00.000Z',
        },
      },
    },
  })
  getHealth(): { status: 'ok'; timestamp: string } {
    return this.healthService.getHealthStatus();
  }
}
