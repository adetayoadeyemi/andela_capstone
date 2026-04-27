import { IsString, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class WebhookChangeDto {
  @ApiProperty({
    description: 'Type of change (e.g., messages, message_echoes)',
    example: 'messages',
  })
  @IsString()
  @IsNotEmpty()
  field!: string;

  @ApiProperty({
    description: 'Change payload data',
    example: {},
  })
  @IsNotEmpty()
  value!: any;
}

export class WebhookEntryDto {
  @ApiProperty({
    description: 'WhatsApp Business Account ID',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({
    description: 'Array of changes in this webhook event',
    type: [WebhookChangeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookChangeDto)
  changes!: WebhookChangeDto[];
}

export class WhatsAppWebhookDto {
  @ApiProperty({
    description: 'Object type (always "whatsapp_business_account")',
    example: 'whatsapp_business_account',
  })
  @IsString()
  @IsNotEmpty()
  object!: string;

  @ApiProperty({
    description: 'Array of webhook entries',
    type: [WebhookEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookEntryDto)
  entry!: WebhookEntryDto[];
}
