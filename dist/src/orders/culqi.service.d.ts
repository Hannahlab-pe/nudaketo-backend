interface CulqiChargeResult {
    id: string;
    outcome: {
        type: string;
    };
}
export declare class CulqiService {
    private readonly secretKey;
    createCharge(params: {
        amount: number;
        currency: string;
        email: string;
        sourceId: string;
        description: string;
    }): Promise<CulqiChargeResult>;
}
export {};
