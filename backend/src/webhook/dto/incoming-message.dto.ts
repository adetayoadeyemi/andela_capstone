import { IsString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MessageTextDto {
  @ApiProperty({
    description: 'Text message body',
    example: 'Buy 3 tubers of yam and 2 brooms',
  })
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class IncomingMessageDto {
  @ApiProperty({
    description: 'Sender phone number',
    example: '2348012345678',
  })
  @IsString()
  @IsNotEmpty()
  from!: string;

  @ApiProperty({
    description: 'Message ID',
    example: 'wamid.ABC123',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'Message timestamp',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  timestamp!: string;

  @ApiProperty({
    description: 'Message type',
    example: 'text',
    enum: ['text', 'image', 'audio', 'video', 'document'],
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional({
    description: 'Text message content',
    type: MessageTextDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MessageTextDto)
  text?: MessageTextDto;
}
