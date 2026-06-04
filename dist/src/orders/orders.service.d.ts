import { PrismaService } from '../prisma/prisma.service';
import { CulqiService } from './culqi.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    private culqi;
    constructor(prisma: PrismaService, culqi: CulqiService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        orderId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        totalCents: number;
        createdAt: Date;
    }>;
    findAll(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
