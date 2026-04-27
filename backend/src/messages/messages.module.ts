import { Module } from '@nestjs/common'
import { MessagesRepository } from './messages.repository'
import { MessagesService } from './messages.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [MessagesRepository, MessagesService],
  exports: [MessagesService], // 👈 important
})
export class MessagesModule {}