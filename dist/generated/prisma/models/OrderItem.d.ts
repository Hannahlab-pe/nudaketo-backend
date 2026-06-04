import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type OrderItemModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderItemPayload>;
export type AggregateOrderItem = {
    _count: OrderItemCountAggregateOutputType | null;
    _avg: OrderItemAvgAggregateOutputType | null;
    _sum: OrderItemSumAggregateOutputType | null;
    _min: OrderItemMinAggregateOutputType | null;
    _max: OrderItemMaxAggregateOutputType | null;
};
export type OrderItemAvgAggregateOutputType = {
    productId: number | null;
    qty: number | null;
    price: number | null;
};
export type OrderItemSumAggregateOutputType = {
    productId: number | null;
    qty: number | null;
    price: number | null;
};
export type OrderItemMinAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    productId: number | null;
    sizeId: string | null;
    name: string | null;
    qty: number | null;
    price: number | null;
};
export type OrderItemMaxAggregateOutputType = {
    id: string | null;
    orderId: string | null;
    productId: number | null;
    sizeId: string | null;
    name: string | null;
    qty: number | null;
    price: number | null;
};
export type OrderItemCountAggregateOutputType = {
    id: number;
    orderId: number;
    productId: number;
    sizeId: number;
    name: number;
    qty: number;
    price: number;
    _all: number;
};
export type OrderItemAvgAggregateInputType = {
    productId?: true;
    qty?: true;
    price?: true;
};
export type OrderItemSumAggregateInputType = {
    productId?: true;
    qty?: true;
    price?: true;
};
export type OrderItemMinAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    sizeId?: true;
    name?: true;
    qty?: true;
    price?: true;
};
export type OrderItemMaxAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    sizeId?: true;
    name?: true;
    qty?: true;
    price?: true;
};
export type OrderItemCountAggregateInputType = {
    id?: true;
    orderId?: true;
    productId?: true;
    sizeId?: true;
    name?: true;
    qty?: true;
    price?: true;
    _all?: true;
};
export type OrderItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderItemCountAggregateInputType;
    _avg?: OrderItemAvgAggregateInputType;
    _sum?: OrderItemSumAggregateInputType;
    _min?: OrderItemMinAggregateInputType;
    _max?: OrderItemMaxAggregateInputType;
};
export type GetOrderItemAggregateType<T extends OrderItemAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrderItem[P]> : Prisma.GetScalarType<T[P], AggregateOrderItem[P]>;
};
export type OrderItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithAggregationInput | Prisma.OrderItemOrderByWithAggregationInput[];
    by: Prisma.OrderItemScalarFieldEnum[] | Prisma.OrderItemScalarFieldEnum;
    having?: Prisma.OrderItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderItemCountAggregateInputType | true;
    _avg?: OrderItemAvgAggregateInputType;
    _sum?: OrderItemSumAggregateInputType;
    _min?: OrderItemMinAggregateInputType;
    _max?: OrderItemMaxAggregateInputType;
};
export type OrderItemGroupByOutputType = {
    id: string;
    orderId: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
    _count: OrderItemCountAggregateOutputType | null;
    _avg: OrderItemAvgAggregateOutputType | null;
    _sum: OrderItemSumAggregateOutputType | null;
    _min: OrderItemMinAggregateOutputType | null;
    _max: OrderItemMaxAggregateOutputType | null;
};
export type GetOrderItemGroupByPayload<T extends OrderItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderItemGroupByOutputType[P]>;
}>>;
export type OrderItemWhereInput = {
    AND?: Prisma.OrderItemWhereInput | Prisma.OrderItemWhereInput[];
    OR?: Prisma.OrderItemWhereInput[];
    NOT?: Prisma.OrderItemWhereInput | Prisma.OrderItemWhereInput[];
    id?: Prisma.StringFilter<"OrderItem"> | string;
    orderId?: Prisma.StringFilter<"OrderItem"> | string;
    productId?: Prisma.IntFilter<"OrderItem"> | number;
    sizeId?: Prisma.StringFilter<"OrderItem"> | string;
    name?: Prisma.StringFilter<"OrderItem"> | string;
    qty?: Prisma.IntFilter<"OrderItem"> | number;
    price?: Prisma.FloatFilter<"OrderItem"> | number;
    order?: Prisma.XOR<Prisma.OrderScalarRelationFilter, Prisma.OrderWhereInput>;
};
export type OrderItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    sizeId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    order?: Prisma.OrderOrderByWithRelationInput;
};
export type OrderItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OrderItemWhereInput | Prisma.OrderItemWhereInput[];
    OR?: Prisma.OrderItemWhereInput[];
    NOT?: Prisma.OrderItemWhereInput | Prisma.OrderItemWhereInput[];
    orderId?: Prisma.StringFilter<"OrderItem"> | string;
    productId?: Prisma.IntFilter<"OrderItem"> | number;
    sizeId?: Prisma.StringFilter<"OrderItem"> | string;
    name?: Prisma.StringFilter<"OrderItem"> | string;
    qty?: Prisma.IntFilter<"OrderItem"> | number;
    price?: Prisma.FloatFilter<"OrderItem"> | number;
    order?: Prisma.XOR<Prisma.OrderScalarRelationFilter, Prisma.OrderWhereInput>;
}, "id">;
export type OrderItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    sizeId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    _count?: Prisma.OrderItemCountOrderByAggregateInput;
    _avg?: Prisma.OrderItemAvgOrderByAggregateInput;
    _max?: Prisma.OrderItemMaxOrderByAggregateInput;
    _min?: Prisma.OrderItemMinOrderByAggregateInput;
    _sum?: Prisma.OrderItemSumOrderByAggregateInput;
};
export type OrderItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderItemScalarWhereWithAggregatesInput | Prisma.OrderItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderItemScalarWhereWithAggregatesInput | Prisma.OrderItemScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"OrderItem"> | string;
    orderId?: Prisma.StringWithAggregatesFilter<"OrderItem"> | string;
    productId?: Prisma.IntWithAggregatesFilter<"OrderItem"> | number;
    sizeId?: Prisma.StringWithAggregatesFilter<"OrderItem"> | string;
    name?: Prisma.StringWithAggregatesFilter<"OrderItem"> | string;
    qty?: Prisma.IntWithAggregatesFilter<"OrderItem"> | number;
    price?: Prisma.FloatWithAggregatesFilter<"OrderItem"> | number;
};
export type OrderItemCreateInput = {
    id?: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
    order: Prisma.OrderCreateNestedOneWithoutItemsInput;
};
export type OrderItemUncheckedCreateInput = {
    id?: string;
    orderId: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
};
export type OrderItemUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    order?: Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput;
};
export type OrderItemUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemCreateManyInput = {
    id?: string;
    orderId: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
};
export type OrderItemUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    orderId?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemListRelationFilter = {
    every?: Prisma.OrderItemWhereInput;
    some?: Prisma.OrderItemWhereInput;
    none?: Prisma.OrderItemWhereInput;
};
export type OrderItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    sizeId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemAvgOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    sizeId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    orderId?: Prisma.SortOrder;
    productId?: Prisma.SortOrder;
    sizeId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemSumOrderByAggregateInput = {
    productId?: Prisma.SortOrder;
    qty?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type OrderItemCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput> | Prisma.OrderItemCreateWithoutOrderInput[] | Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemCreateOrConnectWithoutOrderInput | Prisma.OrderItemCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderItemCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
};
export type OrderItemUncheckedCreateNestedManyWithoutOrderInput = {
    create?: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput> | Prisma.OrderItemCreateWithoutOrderInput[] | Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemCreateOrConnectWithoutOrderInput | Prisma.OrderItemCreateOrConnectWithoutOrderInput[];
    createMany?: Prisma.OrderItemCreateManyOrderInputEnvelope;
    connect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
};
export type OrderItemUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput> | Prisma.OrderItemCreateWithoutOrderInput[] | Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemCreateOrConnectWithoutOrderInput | Prisma.OrderItemCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderItemCreateManyOrderInputEnvelope;
    set?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    disconnect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    delete?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    connect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    update?: Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput | Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderItemScalarWhereInput | Prisma.OrderItemScalarWhereInput[];
};
export type OrderItemUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput> | Prisma.OrderItemCreateWithoutOrderInput[] | Prisma.OrderItemUncheckedCreateWithoutOrderInput[];
    connectOrCreate?: Prisma.OrderItemCreateOrConnectWithoutOrderInput | Prisma.OrderItemCreateOrConnectWithoutOrderInput[];
    upsert?: Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput | Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput[];
    createMany?: Prisma.OrderItemCreateManyOrderInputEnvelope;
    set?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    disconnect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    delete?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    connect?: Prisma.OrderItemWhereUniqueInput | Prisma.OrderItemWhereUniqueInput[];
    update?: Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput | Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput[];
    updateMany?: Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput | Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput[];
    deleteMany?: Prisma.OrderItemScalarWhereInput | Prisma.OrderItemScalarWhereInput[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type OrderItemCreateWithoutOrderInput = {
    id?: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
};
export type OrderItemUncheckedCreateWithoutOrderInput = {
    id?: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
};
export type OrderItemCreateOrConnectWithoutOrderInput = {
    where: Prisma.OrderItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput>;
};
export type OrderItemCreateManyOrderInputEnvelope = {
    data: Prisma.OrderItemCreateManyOrderInput | Prisma.OrderItemCreateManyOrderInput[];
    skipDuplicates?: boolean;
};
export type OrderItemUpsertWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderItemUpdateWithoutOrderInput, Prisma.OrderItemUncheckedUpdateWithoutOrderInput>;
    create: Prisma.XOR<Prisma.OrderItemCreateWithoutOrderInput, Prisma.OrderItemUncheckedCreateWithoutOrderInput>;
};
export type OrderItemUpdateWithWhereUniqueWithoutOrderInput = {
    where: Prisma.OrderItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderItemUpdateWithoutOrderInput, Prisma.OrderItemUncheckedUpdateWithoutOrderInput>;
};
export type OrderItemUpdateManyWithWhereWithoutOrderInput = {
    where: Prisma.OrderItemScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderItemUpdateManyMutationInput, Prisma.OrderItemUncheckedUpdateManyWithoutOrderInput>;
};
export type OrderItemScalarWhereInput = {
    AND?: Prisma.OrderItemScalarWhereInput | Prisma.OrderItemScalarWhereInput[];
    OR?: Prisma.OrderItemScalarWhereInput[];
    NOT?: Prisma.OrderItemScalarWhereInput | Prisma.OrderItemScalarWhereInput[];
    id?: Prisma.StringFilter<"OrderItem"> | string;
    orderId?: Prisma.StringFilter<"OrderItem"> | string;
    productId?: Prisma.IntFilter<"OrderItem"> | number;
    sizeId?: Prisma.StringFilter<"OrderItem"> | string;
    name?: Prisma.StringFilter<"OrderItem"> | string;
    qty?: Prisma.IntFilter<"OrderItem"> | number;
    price?: Prisma.FloatFilter<"OrderItem"> | number;
};
export type OrderItemCreateManyOrderInput = {
    id?: string;
    productId: number;
    sizeId: string;
    name: string;
    qty: number;
    price: number;
};
export type OrderItemUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemUncheckedUpdateWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemUncheckedUpdateManyWithoutOrderInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    productId?: Prisma.IntFieldUpdateOperationsInput | number;
    sizeId?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    qty?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
};
export type OrderItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    sizeId?: boolean;
    name?: boolean;
    qty?: boolean;
    price?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderItem"]>;
export type OrderItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    sizeId?: boolean;
    name?: boolean;
    qty?: boolean;
    price?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderItem"]>;
export type OrderItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    sizeId?: boolean;
    name?: boolean;
    qty?: boolean;
    price?: boolean;
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderItem"]>;
export type OrderItemSelectScalar = {
    id?: boolean;
    orderId?: boolean;
    productId?: boolean;
    sizeId?: boolean;
    name?: boolean;
    qty?: boolean;
    price?: boolean;
};
export type OrderItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "orderId" | "productId" | "sizeId" | "name" | "qty" | "price", ExtArgs["result"]["orderItem"]>;
export type OrderItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type OrderItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type OrderItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    order?: boolean | Prisma.OrderDefaultArgs<ExtArgs>;
};
export type $OrderItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrderItem";
    objects: {
        order: Prisma.$OrderPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        orderId: string;
        productId: number;
        sizeId: string;
        name: string;
        qty: number;
        price: number;
    }, ExtArgs["result"]["orderItem"]>;
    composites: {};
};
export type OrderItemGetPayload<S extends boolean | null | undefined | OrderItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderItemPayload, S>;
export type OrderItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderItemCountAggregateInputType | true;
};
export interface OrderItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrderItem'];
        meta: {
            name: 'OrderItem';
        };
    };
    findUnique<T extends OrderItemFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderItemFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderItemFindManyArgs>(args?: Prisma.SelectSubset<T, OrderItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderItemCreateArgs>(args: Prisma.SelectSubset<T, OrderItemCreateArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderItemCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrderItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrderItemDeleteArgs>(args: Prisma.SelectSubset<T, OrderItemDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderItemUpdateArgs>(args: Prisma.SelectSubset<T, OrderItemUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderItemUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrderItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrderItemUpsertArgs>(args: Prisma.SelectSubset<T, OrderItemUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderItemClient<runtime.Types.Result.GetResult<Prisma.$OrderItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderItemCountArgs>(args?: Prisma.Subset<T, OrderItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderItemCountAggregateOutputType> : number>;
    aggregate<T extends OrderItemAggregateArgs>(args: Prisma.Subset<T, OrderItemAggregateArgs>): Prisma.PrismaPromise<GetOrderItemAggregateType<T>>;
    groupBy<T extends OrderItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderItemGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderItemGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderItemFieldRefs;
}
export interface Prisma__OrderItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    order<T extends Prisma.OrderDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.OrderDefaultArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderItemFieldRefs {
    readonly id: Prisma.FieldRef<"OrderItem", 'String'>;
    readonly orderId: Prisma.FieldRef<"OrderItem", 'String'>;
    readonly productId: Prisma.FieldRef<"OrderItem", 'Int'>;
    readonly sizeId: Prisma.FieldRef<"OrderItem", 'String'>;
    readonly name: Prisma.FieldRef<"OrderItem", 'String'>;
    readonly qty: Prisma.FieldRef<"OrderItem", 'Int'>;
    readonly price: Prisma.FieldRef<"OrderItem", 'Float'>;
}
export type OrderItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where: Prisma.OrderItemWhereUniqueInput;
};
export type OrderItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where: Prisma.OrderItemWhereUniqueInput;
};
export type OrderItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemScalarFieldEnum | Prisma.OrderItemScalarFieldEnum[];
};
export type OrderItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemScalarFieldEnum | Prisma.OrderItemScalarFieldEnum[];
};
export type OrderItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where?: Prisma.OrderItemWhereInput;
    orderBy?: Prisma.OrderItemOrderByWithRelationInput | Prisma.OrderItemOrderByWithRelationInput[];
    cursor?: Prisma.OrderItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderItemScalarFieldEnum | Prisma.OrderItemScalarFieldEnum[];
};
export type OrderItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemCreateInput, Prisma.OrderItemUncheckedCreateInput>;
};
export type OrderItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderItemCreateManyInput | Prisma.OrderItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    data: Prisma.OrderItemCreateManyInput | Prisma.OrderItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrderItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrderItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemUpdateInput, Prisma.OrderItemUncheckedUpdateInput>;
    where: Prisma.OrderItemWhereUniqueInput;
};
export type OrderItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderItemUpdateManyMutationInput, Prisma.OrderItemUncheckedUpdateManyInput>;
    where?: Prisma.OrderItemWhereInput;
    limit?: number;
};
export type OrderItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderItemUpdateManyMutationInput, Prisma.OrderItemUncheckedUpdateManyInput>;
    where?: Prisma.OrderItemWhereInput;
    limit?: number;
    include?: Prisma.OrderItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrderItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where: Prisma.OrderItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderItemCreateInput, Prisma.OrderItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderItemUpdateInput, Prisma.OrderItemUncheckedUpdateInput>;
};
export type OrderItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
    where: Prisma.OrderItemWhereUniqueInput;
};
export type OrderItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderItemWhereInput;
    limit?: number;
};
export type OrderItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderItemSelect<ExtArgs> | null;
    omit?: Prisma.OrderItemOmit<ExtArgs> | null;
    include?: Prisma.OrderItemInclude<ExtArgs> | null;
};
