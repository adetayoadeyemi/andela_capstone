import { Injectable } from '@nestjs/common';
import { ShoppingListRepository } from './shopping-list.repository';
import { ShoppingListItemRepository } from './shopping-list-item.repository';
import { CreateShoppingListDto } from './dto/create-shopping-list-dto';

@Injectable()
export class ShoppingService {
  constructor(
    private listRepo: ShoppingListRepository,
    private itemRepo: ShoppingListItemRepository,
  ) {}

  async getOrCreateActiveList(dto: CreateShoppingListDto) {
    let list = await this.listRepo.getActiveByUser(dto.userId);

    if (!list) {
      list = await this.listRepo.create(dto.userId, dto.name);
    }

    return list;
  }

  async addItem(userId: string, productName: string, quantity: number) {
    const list = await this.getOrCreateActiveList({ userId, name: 'Default List' });

    await this.itemRepo.incrementItem(list.id,productName,quantity,);

    await this.listRepo.updateLastActivity(list.id);

    return {
    message: `Added ${quantity} ${productName}`,
    };
  }

  async getCurrentList(userId: string) {
    const list = await this.listRepo.getActiveByUser(userId);
    if (!list) return [];

    return this.itemRepo.getItems(list.id);
  }
}