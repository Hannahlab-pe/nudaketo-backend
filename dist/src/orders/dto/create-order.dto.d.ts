export declare class OrderItemDto {
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
}
export declare class CreateOrderDto {
    culqiToken: string;
    email: string;
    items: OrderItemDto[];
    totalCents: number;
}
