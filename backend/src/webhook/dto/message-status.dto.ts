import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class MessageStatusDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsArray()
  @IsOptional()
  errors?: any[];
}
