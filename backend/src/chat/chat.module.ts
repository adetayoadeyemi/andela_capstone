import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AiModule } from '../ai/ai.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
    exports: [ChatService],
    imports: [AiModule, MessagesModule],
    providers: [ChatService],
})
export class ChatModule {}