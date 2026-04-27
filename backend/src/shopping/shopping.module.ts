import { Module } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { ShoppingListRepository } from './shopping-list.repository';
import { ShoppingListItemRepository } from './shopping-list-item.repository';

@Module({
  providers: [
    ShoppingService,
    ShoppingListRepository,
    ShoppingListItemRepository,
  ],
  exports: [
    ShoppingService, // IMPORTANT: so AI / ToolHandler can use it
  ],
})
export class ShoppingModule {}