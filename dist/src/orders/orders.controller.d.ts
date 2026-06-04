import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, dto: CreateOrderDto): Promise<{
        orderId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalCents: number;
        createdAt: Date;
    }>;
    findAll(req: any): import(".prisma/client").Prisma.PrismaPromise<({
        items: {
            id: string;
            name: string;
            orderId: string;
            productId: number;
            sizeId: string;
            qty: number;
            price: number;
        }[];
    } & {
        id: string;
        email: string;
        createdAt: Date;
        userId: string;
        culqiCharge: string;
        totalCents: number;
        status: import(".prisma/client").$Enums.OrderStatus;
    })[]>;
}
