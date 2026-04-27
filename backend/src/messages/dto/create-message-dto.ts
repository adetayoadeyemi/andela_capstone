export interface CreateMessageDto {
  userId: string
  body: string
  sender_type?: 'user' | 'assistant'
}