export default class Message {
  id: string;
  userId: string;
  body: string;
  senderType: 'user' | 'assistant';
  createdAt: Date;

  constructor(id: string, userId: string, senderType: 'user' | 'assistant', body: string, createdAt: Date, ) {
    this.id = id;
    this.userId = userId;
    this.body = body;
    this.createdAt = createdAt;
    this.senderType = senderType;
  }

  static fromPersistence(row: any): Message {
    if (!row.id) throw new Error('Invalid message row');
    return new Message(
      row.id,
      row.user_id,
      row.sender_type as 'user' | 'assistant',
      row.body ?? '',
      new Date(row.created_at),
    );
  }

}