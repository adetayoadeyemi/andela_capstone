import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources';
import ProcessMessageDto from './dto/process-message-dto';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processMessage(dto:ProcessMessageDto) {
    const { userDetails, messages } = dto;
    const computedMessages = messages.map(m => {
        if(m.senderType == 'tool') return { role: m.senderType, content: m.message, tool_call_id: m.toolCallId||'' }
        if(m.senderType == 'assistant' && m.toolCalls) return { role: m.senderType, content: m.message, tool_calls: m.toolCalls }
        return { role: m.senderType, content: m.message }
    })
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: this.buildSystemPrompt(userDetails),
        },
        ...computedMessages as any,
      ],
      tools: this.getTools(),
      tool_choice: 'auto',
    });

    return response.choices[0];
  }

  private buildSystemPrompt(userDetails: ProcessMessageDto['userDetails']): string  {
    return `
        You are a brilliant Nigerian shopping assistant with deep knowledge of local markets and products especially in Lagos Nigeria.

        use the tools at your disposal to help the user build and manage their shopping list, and provide accurate estimates of total cost and time based on current market conditions.

        you are provided with the user's profile, however it may be incomplete, so, keep asking questions to fill in the gaps, when you get a new user detail, use the appropriate tool to update the profile.

        User profile: ${JSON.stringify(userDetails)}
    `;
  }

  private getTools(): Array<ChatCompletionTool> {
    return [
      {
        type: 'function',
        function: {
          name: 'add_item_to_list',
          description: 'Add item to shopping list',
          parameters: {
            type: 'object',
            properties: {
              item_name: { type: 'string' },
              quantity: { type: 'number' },
            },
            required: ['item_name', 'quantity'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'estimate_list',
          description: 'Estimate total cost and time',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_user_shopping_list',
          description: 'Get all user shopping list',
          parameters: {
            type: 'object',
            properties: {
                user_id: { type: 'string' },
            },
            required: ['user_id'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'get_shopping_list_details',
          description: 'Get full details of active shopping list, including items and estimates',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      },
    ];
  }
}