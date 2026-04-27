import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({
    example: 'ok',
    description: 'Health status',
  })
  status!: string;

  @ApiProperty({
    example: 1234.56,
    description: 'Server uptime in seconds',
  })
  uptime!: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Current timestamp',
  })
  timestamp!: string;
}
