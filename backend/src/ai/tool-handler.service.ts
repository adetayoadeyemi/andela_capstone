import { Injectable } from '@nestjs/common';
import { ShoppingService } from 'src/shopping/shopping.service';

@Injectable()
export class ToolHandlerService {

    constructor(private readonly shoppingService: ShoppingService) {}

    async execute(toolCall: any, userId: string): Promise<{status:string,message:string}> {
        const { name, arguments: args } = toolCall.function;

        const parsedArgs = JSON.parse(args);

        switch (name) {
        case 'add_item_to_list':
            return this.addItem(userId, parsedArgs);

        case 'estimate_list':
            return this.estimateList(userId);

        default:
            throw new Error(`Unknown tool: ${name}`);
        }
    }

    private async addItem(userId: string, args: any): Promise<{status:string,message:string}> {
        const { item_name, quantity } = args;

        await this.shoppingService.addItem(userId, item_name, quantity);

        return {
            status: 'success',
            message: `Added ${quantity} ${item_name}`,
        };
    }

    private async estimateList(shoppingListId: string): Promise<{status:string,message:string}> {
        return {
            status: 'success',
            message: `Estimated total: 9200, Time: 15 minutes`,
        };
    }

}