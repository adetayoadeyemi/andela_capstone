import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from '../common/whatsapp.service';
import { MessagesModule } from '../messages/messages.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/users.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [ConfigModule, HttpModule, MessagesModule,AuthModule,UsersModule, ChatModule],
  controllers: [WebhookController],
  providers: [WhatsappService],
})
export class WebhookModule {}
