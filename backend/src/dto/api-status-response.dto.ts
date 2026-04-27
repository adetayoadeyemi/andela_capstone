import { ApiProperty } from '@nestjs/swagger';

export class ApiStatusResponseDto {
  @ApiProperty({
    example: 'ok',
    description: 'API status',
  })
  status!: string;

  @ApiProperty({
    example: 'Errand AI is running',
    description: 'API message',
  })
  message!: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'API version',
  })
  version!: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Current timestamp',
  })
  timestamp!: string;
}
