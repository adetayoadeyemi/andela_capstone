export default class ShoppingList {
    
  constructor(
    public id: string,
    public userId: string,
    public status: string,
    public createdAt: Date,
    public updatedAt: Date,
    public lastActivityAt: Date,
  ) {}

  static fromPersistence(row: any): ShoppingList {
    return new ShoppingList(
      row.id,
      row.user_id,
      row.status,
      new Date(row.created_at),
      new Date(row.updated_at),
      new Date(row.last_activity_at),
    );
  }
}