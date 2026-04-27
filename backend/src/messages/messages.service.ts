import { Injectable } from '@nestjs/common'
import { MessagesRepository } from './messages.repository'
import { CreateMessageDto } from './dto/create-message-dto'

@Injectable()
export class MessagesService {
  constructor(private readonly repo: MessagesRepository) {}

  async saveMessage(dto: CreateMessageDto) {
    return this.repo.createMessage(dto)
  }

  async getUserMessages(userId: string) {
    return this.repo.getMessagesByUser(userId)
  }
}