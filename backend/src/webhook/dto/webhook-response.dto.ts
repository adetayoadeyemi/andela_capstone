import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({
    example: 'success',
    description: 'Processing status',
    enum: ['success', 'error'],
  })
  status!: string;

  @ApiProperty({
    example: 'Webhook processed',
    description: 'Response message',
  })
  message!: string;
}
