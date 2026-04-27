import { Inject, Injectable } from '@nestjs/common'
import postgres from 'postgres'
import { DATABASE } from '../database/database.module'
import { CreateMessageDto } from './dto/create-message-dto'
import Message from '../domain/message'



@Injectable()
export class MessagesRepository {

  constructor(
    @Inject(DATABASE)
    private readonly sql: ReturnType<typeof postgres>,
  ) {}

  async createMessage(dto: CreateMessageDto) {
    console.log('Creating message with DTO:', dto)
    const [message] = await this.sql`
      INSERT INTO messages (user_id, body, sender_type)
      VALUES (${dto.userId}, ${dto.body}, ${dto.sender_type || 'user'})
      RETURNING id, user_id, body, sender_type, created_at
    `
    return Message.fromPersistence(message)
  }

  async getMessagesByUser(userId: string, limit = 20): Promise<Array<Message>> {
    const rows = await this.sql`
      SELECT id, user_id, body, sender_type, created_at
      FROM messages
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return rows.map(Message.fromPersistence)
    
  }
}