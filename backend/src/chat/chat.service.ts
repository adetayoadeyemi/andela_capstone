import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ToolHandlerService } from '../ai/tool-handler.service';
import { MessagesService } from 'src/messages/messages.service';
import HandleIncomingMessageDto from './dto/handle-incoming-message-dto';

@Injectable()
export class ChatService {
  constructor(
    private aiService: AiService,
    private toolHandler: ToolHandlerService,
    private messagesService: MessagesService,
  ) {}

  async handleIncomingMessage(dto: HandleIncomingMessageDto) {
    const { userDetails, message } = dto;
    // 1. Load session state
    const messages:Array<any> = await this.getMessages(userDetails.id);
    messages.push({ message: message, senderType: 'user' });

    // 2. Call AI
    const aiResponse = await this.aiService.processMessage({
      messages,
      userDetails,
    });

    const msg = aiResponse.message;

    // 3. If tool call
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const toolCall = msg.tool_calls[0];
      messages.push({ message: msg.content, toolCalls: msg.tool_calls, senderType: 'assistant' });
      const result = await this.toolHandler.execute(toolCall, userDetails.id);
      messages.push({ message: JSON.stringify(result), senderType: 'tool', toolCallId: toolCall.id });
      console.log(messages)
      // 4. Send result back to AI for natural response
      const finalResponse = await this.aiService.processMessage({
        messages,
        userDetails,
      });
      console.log('Final AI response:', finalResponse);

      return finalResponse.message.content;
    }

    // 5. Normal response
    return msg.content;
  }

  private async getMessages(userId: string):Promise<Array<{message:string,senderType:'user'|'assistant'|'tool'}>> {
    // TODO: fetch active list from DB
    const userMessages = await this.messagesService.getUserMessages(userId);
    return userMessages.map((m) => ({
      message: m.body,
      senderType: m.senderType.toLocaleLowerCase() as 'user' | 'assistant' | 'tool',
    }));
  }
}