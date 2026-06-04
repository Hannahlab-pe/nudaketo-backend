"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CulqiService = void 0;
const common_1 = require("@nestjs/common");
const https_1 = __importDefault(require("https"));
let CulqiService = class CulqiService {
    secretKey = process.env.CULQI_SECRET_KEY || '';
    async createCharge(params) {
        const body = JSON.stringify({
            amount: params.amount,
            currency_code: params.currency,
            email: params.email,
            source_id: params.sourceId,
            description: params.description,
        });
        return new Promise((resolve, reject) => {
            const req = https_1.default.request({
                hostname: 'api.culqi.com',
                path: '/v2/charges',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => (data += chunk));
                res.on('end', () => {
                    const parsed = JSON.parse(data);
                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new common_1.BadRequestException(parsed.user_message || 'Error al procesar el pago con Culqi'));
                    }
                    else {
                        resolve(parsed);
                    }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    }
};
exports.CulqiService = CulqiService;
exports.CulqiService = CulqiService = __decorate([
    (0, common_1.Injectable)()
], CulqiService);
//# sourceMappingURL=culqi.service.js.map