export default class ShoppingListItem {
    
    constructor(
        public id: string,
        public listId: string,
        public productName: string,
        public providedProductName: string,
        public unit: number,
        public createdAt: Date,
    ) {}

    static fromPersistence(row: any): ShoppingListItem {
        return new ShoppingListItem(
        row.id,
        row.shopping_list_id,
        row.product_name,
        row.provided_product_name,
        row.unit,
        new Date(row.created_at),
        );
    }


}