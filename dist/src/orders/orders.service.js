"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const culqi_service_1 = require("./culqi.service");
let OrdersService = class OrdersService {
    prisma;
    culqi;
    constructor(prisma, culqi) {
        this.prisma = prisma;
        this.culqi = culqi;
    }
    async create(userId, dto) {
        const charge = await this.culqi.createCharge({
            amount: dto.totalCents,
            currency: 'PEN',
            email: dto.email,
            sourceId: dto.culqiToken,
            description: `Pedido NUDA KETO — ${dto.items.length} producto(s)`,
        });
        const order = await this.prisma.order.create({
            data: {
                userId,
                culqiCharge: charge.id,
                email: dto.email,
                totalCents: dto.totalCents,
                items: {
                    create: dto.items.map((i) => ({
                        productId: i.productId,
                        sizeId: i.sizeId,
                        name: i.name,
                        qty: i.qty,
                        price: i.price,
                    })),
                },
            },
            include: { items: true },
        });
        return {
            orderId: order.id,
            status: order.status,
            totalCents: order.totalCents,
            createdAt: order.createdAt,
        };
    }
    findAll(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        culqi_service_1.CulqiService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map