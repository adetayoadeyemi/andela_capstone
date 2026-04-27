import {
  IsObject,
  IsArray,
  IsOptional,
  ValidateNested,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncomingMessageDto } from './incoming-message.dto';
import { MessageStatusDto } from './message-status.dto';

export class MetadataDto {
  @ApiProperty({
    description: 'Display phone number',
    example: '+234801234567',
  })
  @IsString()
  @IsNotEmpty()
  display_phone_number!: string;

  @ApiProperty({
    description: 'Phone number ID',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  phone_number_id!: string;
}

export class MessageDataDto {
  @ApiProperty({
    description: 'Metadata about the phone number',
    type: MetadataDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata!: MetadataDto;

  @ApiPropertyOptional({
    description: 'Contact information',
    type: [Object],
  })
  @IsArray()
  @IsOptional()
  contacts?: any[];

  @ApiPropertyOptional({
    description: 'Array of incoming messages',
    type: [IncomingMessageDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => IncomingMessageDto)
  messages?: IncomingMessageDto[];

  @ApiPropertyOptional({
    description: 'Array of message statuses',
    type: [MessageStatusDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MessageStatusDto)
  statuses?: MessageStatusDto[];
}
