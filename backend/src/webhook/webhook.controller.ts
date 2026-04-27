import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { WhatsAppWebhookDto } from './dto/whatsapp-webhook.dto';
import { MessageDataDto } from './dto/message-data.dto';
import { IncomingMessageDto } from './dto/incoming-message.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from '../common/whatsapp.service';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../user/users.service';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly whatsappService: WhatsappService,
    private readonly messagesService: MessagesService,
    private readonly chatService: ChatService,
  ) {}

  /**
   * GET /webhook/whatsapp
   * WhatsApp webhook verification endpoint
   * WhatsApp will call this to verify the webhook URL
   */
  @Get('whatsapp')
  @ApiOperation({
    summary: 'Verify WhatsApp webhook',
    description:
      'WhatsApp calls this endpoint to verify the webhook URL during setup',
  })
  @ApiQuery({
    name: 'hub.mode',
    required: true,
    description: 'Verification mode (should be "subscribe")',
    example: 'subscribe',
  })
  @ApiQuery({
    name: 'hub.verify_token',
    required: true,
    description: 'Verification token configured in WhatsApp dashboard',
  })
  @ApiQuery({
    name: 'hub.challenge',
    required: true,
    description: 'Challenge string to return for verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook verified successfully - returns challenge',
    type: String,
  })
  @ApiResponse({
    status: 403,
    description: 'Verification failed - invalid token or mode',
  })
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    this.logger.log('Webhook verification request received');

    const verifyToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    // Check if mode and token are correct
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('Webhook verified successfully');
      // Return challenge to complete verification
      return challenge;
    }

    this.logger.error('Webhook verification failed - Invalid token or mode');
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  /**
   * POST /webhook/whatsapp
   * Receives incoming WhatsApp messages and events
   */
  @Post('whatsapp')
  @ApiOperation({
    summary: 'Receive WhatsApp webhook events',
    description:
      'Handles incoming WhatsApp messages, status updates, and other events',
  })
  @ApiBody({
    type: WhatsAppWebhookDto,
    description: 'WhatsApp webhook payload',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
    type: WebhookResponseDto,
  })
  async handleWebhook(
    @Body() webhookData: WhatsAppWebhookDto,
  ): Promise<WebhookResponseDto> {
    this.logger.log('Webhook event received');
    this.logger.debug(`Webhook data: ${JSON.stringify(webhookData)}`);

    try {
      // Process each entry in the webhook
      for (const entry of webhookData.entry) {
        // Process each change in the entry
        for (const change of entry.changes) {
          switch (change.field) {
            case 'messages':
              await this.handleMessages(change.value as MessageDataDto);
              break;
            case 'message_echoes':
              this.handleMessageEchoes(change.value);
              break;
            default:
              this.logger.debug(`Unhandled field type: ${change.field}`);
          }
        }
      }

      // Always return 200 OK to WhatsApp
      return {
        status: 'success',
        message: 'Webhook processed',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error processing webhook: ${err.message}`, err.stack);
      // Still return 200 to prevent WhatsApp from retrying
      return {
        status: 'error',
        message: 'Webhook received but processing failed',
      };
    }
  }

  /**
   * Handle incoming messages from users
   */
  private async handleMessages(data: MessageDataDto) {
  
    this.logger.log('Processing messages');

    // Handle status updates (delivery confirmations)
    if (data.statuses) {
      this.logger.log('Status updates received');
      for (const status of data.statuses) {
        this.logger.debug(`Message ${status.id} status: ${status.status}`);
        if (status.errors && status.errors.length > 0) {
          this.logger.error(
            `Status errors for ${status.id}: ${JSON.stringify(status.errors)}`,
          );
        }
      }
    }

    // Handle incoming messages
    if (data.messages) {
      this.logger.log(`Processing ${data.messages.length} message(s)`);

      // Process messages in parallel
      const messageProcessingPromises = data.messages.map((message) =>
        this.handleSingleMessage(message),
      );

      await Promise.all(messageProcessingPromises);
    }
  }

  /**
   * Handle a single incoming message
   */
  private async handleSingleMessage(message: IncomingMessageDto) {
    try {
      this.logger.log(`Processing message from: ${message.from}`);
      this.logger.debug(`Message type: ${message.type}`);

      // Only process text messages for now
      if (message.type === 'text' && message.text?.body) {
        const userMessage = message.text.body;
        const userPhone = message.from;
        let user = await this.usersService.findByPhoneNumber(userPhone);
        if (!user) user = await this.authService.register(userPhone);
        await this.messagesService.saveMessage({
          userId: user.id,
          body: userMessage,
        });
        const chatResponse = await this.chatService.handleIncomingMessage({
          userDetails: user,
          message: userMessage,
        });
        if(chatResponse){
          await this.messagesService.saveMessage({
            userId: user.id,
            body: chatResponse,
            sender_type: 'assistant'
          });
        }
        this.logger.log(`Message content: "${userMessage}"`);
        this.logger.log(`User phone: ${userPhone}`);
        await this.whatsappService.sendMessage(
          chatResponse || 'Sorry, I had trouble processing your message.',
          userPhone,
        );
      } else {
        this.logger.debug(`Ignoring non-text message of type: ${message.type}`);
      }
    } catch (error) {
      this.logger.error(error)
      const err = error as Error;
      this.logger.error(
        `Error processing message ${message.id}: ${err.message}`,
        err.cause,
        err.stack,
      );
      // Don't throw - continue processing other messages
    }
  }

  /**
   * Handle message echoes (messages sent by us)
   */
  private handleMessageEchoes(data: any) {
    this.logger.debug('Message echoes received');
    this.logger.debug(`Echo data: ${JSON.stringify(data)}`);
    // Optional: Can be used for tracking sent messages
  }
}
