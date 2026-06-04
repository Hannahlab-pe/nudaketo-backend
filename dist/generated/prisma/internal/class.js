"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = __importStar(require("@prisma/client/runtime/client"));
const config = {
    "previewFeatures": [],
    "clientVersion": "7.8.0",
    "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider = \"prisma-client\"\n  output   = \"../generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id        String   @id @default(cuid())\n  name      String\n  email     String   @unique\n  password  String\n  createdAt DateTime @default(now())\n  orders    Order[]\n}\n\nmodel Order {\n  id          String      @id @default(cuid())\n  user        User        @relation(fields: [userId], references: [id])\n  userId      String\n  culqiCharge String\n  email       String\n  totalCents  Int\n  status      OrderStatus @default(PAID)\n  items       OrderItem[]\n  createdAt   DateTime    @default(now())\n}\n\nmodel OrderItem {\n  id        String @id @default(cuid())\n  order     Order  @relation(fields: [orderId], references: [id])\n  orderId   String\n  productId Int\n  sizeId    String\n  name      String\n  qty       Int\n  price     Float\n}\n\nenum OrderStatus {\n  PAID\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToUser\"}],\"dbName\":null},\"Order\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"OrderToUser\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"culqiCharge\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"totalCents\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"OrderStatus\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"OrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"productId\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sizeId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"qty\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"user\",\"order\",\"items\",\"_count\",\"orders\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Order.findUnique\",\"Order.findUniqueOrThrow\",\"Order.findFirst\",\"Order.findFirstOrThrow\",\"Order.findMany\",\"Order.createOne\",\"Order.createMany\",\"Order.createManyAndReturn\",\"Order.updateOne\",\"Order.updateMany\",\"Order.updateManyAndReturn\",\"Order.upsertOne\",\"Order.deleteOne\",\"Order.deleteMany\",\"_avg\",\"_sum\",\"Order.groupBy\",\"Order.aggregate\",\"OrderItem.findUnique\",\"OrderItem.findUniqueOrThrow\",\"OrderItem.findFirst\",\"OrderItem.findFirstOrThrow\",\"OrderItem.findMany\",\"OrderItem.createOne\",\"OrderItem.createMany\",\"OrderItem.createManyAndReturn\",\"OrderItem.updateOne\",\"OrderItem.updateMany\",\"OrderItem.updateManyAndReturn\",\"OrderItem.upsertOne\",\"OrderItem.deleteOne\",\"OrderItem.deleteMany\",\"OrderItem.groupBy\",\"OrderItem.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"orderId\",\"productId\",\"sizeId\",\"name\",\"qty\",\"price\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"userId\",\"culqiCharge\",\"email\",\"totalCents\",\"OrderStatus\",\"status\",\"createdAt\",\"password\",\"every\",\"some\",\"none\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "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_ACAHQwEAAAABRAEAAAABRQIAAAABRgEAAAABRwEAAAABSAIAAAABSQgAAAABAQ0AAEEAMAENAABBADAIBAAAdgAgQwEAcwAhRAEAcwAhRQIAdAAhRgEAcwAhRwEAcwAhSAIAdAAhSQgAdQAhAgAAAAkAIA0AAEQAIAdDAQBzACFEAQBzACFFAgB0ACFGAQBzACFHAQBzACFIAgB0ACFJCAB1ACECAAAABwAgDQAARgAgAgAAAAcAIA0AAEYAIAMAAAAJACAUAAA_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_ACANAACvAQAgQwEAcwAhVQEAcwAhVgEAcwAhVwEAcwAhWAIAdAAhWgAAfVoiW0AAfgAhCAMAAH8AIEMBAHMAIVUBAHMAIVYBAHMAIVcBAHMAIVgCAHQAIVoAAH1aIltAAH4AIQIGAAUHBgIDAwABBQoDBgAEAQQAAgEFCwABBwwAAAAAAwYAChoACxsADAAAAAMGAAoaAAsbAAwBAwABAQMAAQUGABEaABQbABUsABItABMAAAAAAAUGABEaABQbABUsABItABMBBAACAQQAAgUGABoaAB0bAB4sABstABwAAAAAAAUGABoaAB0bAB4sABstABwIAgEJDQEKEAELEQEMEgEOFAEPFgYQFwcRGQESGwYTHAgWHQEXHgEYHwYcIgkdIw0eJAIfJQIgJgIhJwIiKAIjKgIkLAYlLQ4mLwInMQYoMg8pMwIqNAIrNQYuOBAvORYwOgMxOwMyPAMzPQM0PgM1QAM2QgY3Qxc4RQM5RwY6SBg7SQM8SgM9SwY-Thk_Tx8"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await import('node:buffer');
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map