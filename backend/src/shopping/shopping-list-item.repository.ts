import { Inject, Injectable } from '@nestjs/common';
import postgres from 'postgres';
import { DATABASE } from '../database/database.module';
import ShoppingListItem from '../domain/shopping-list-item';

@Injectable()
export class ShoppingListItemRepository {
  constructor(
    @Inject(DATABASE)
    private readonly sql: ReturnType<typeof postgres>,
  ) {}

  async addItem(
    listId: string,
    productName: string,
    unit: number,
  ): Promise<ShoppingListItem> {
    const [row] = await this.sql`
      INSERT INTO shopping_list_items (shopping_list_id, product_name, unit)
      VALUES (${listId}, ${productName}, ${unit})
      RETURNING *
    `;
    return ShoppingListItem.fromPersistence(row);
  }

  async getItems(listId: string): Promise<ShoppingListItem[]> {
    const rows = await this.sql`
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = ${listId}
    `;
    return rows.map(ShoppingListItem.fromPersistence);
  }

  async incrementItem(
    listId: string,
    productName: string,
    unit: number,
  ) {
    const [existing] = await this.sql`
      SELECT *
      FROM shopping_list_items
      WHERE shopping_list_id = ${listId}
        AND product_name = ${productName}
    `;

    if (existing) {
      await this.sql`
        UPDATE shopping_list_items
        SET unit = unit + ${unit},
            updated_at = NOW()
        WHERE id = ${existing.id}
      `;
      return;
    }

    await this.addItem(listId, productName, unit);
  }
}