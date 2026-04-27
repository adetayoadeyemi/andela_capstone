import { Inject, Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DATABASE } from '../database/database.module';
import ShoppingList from '../domain/shopping-list';

@Injectable()
export class ShoppingListRepository {
  constructor(
    @Inject(DATABASE)
    private readonly sql: ReturnType<typeof postgres>,
  ) {}

  async create(userId: string, shopping_list_name:string): Promise<ShoppingList> {
    const [row] = await this.sql`
      INSERT INTO shopping_lists (user_id, name)
      VALUES (${userId},${shopping_list_name})
      RETURNING *
    `;
    return ShoppingList.fromPersistence(row);
  }

  async getActiveByUser(userId: string): Promise<ShoppingList | null> {
    const [row] = await this.sql`
      SELECT *
      FROM shopping_lists
      WHERE user_id = ${userId}
        AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    return row ? ShoppingList.fromPersistence(row) : null;
  }

  async updateLastActivity(listId: string) {
    await this.sql`
      UPDATE shopping_lists
      SET last_activity_at = NOW(), updated_at = NOW()
      WHERE id = ${listId}
    `;
  }
}