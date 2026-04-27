import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly apiUrl: string;
  private readonly accessToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>(
      'WHATSAPP_API_URL',
      'https://graph.facebook.com/v22.0/972719679263838/messages',
    );
    this.accessToken =
      this.configService.get<string>('WHATSAPP_ACCESS_TOKEN') || '';
  }

  async sendMessage(message: string, to: string): Promise<AxiosResponse<any>> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            messaging_product: 'whatsapp',
            to,
            type: 'text',
            text: {
              body: message,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response;
    } catch (e) {
      console.error(e);
      throw new HttpException('Failed to send WhatsApp message', 500);
    }
  }
}
