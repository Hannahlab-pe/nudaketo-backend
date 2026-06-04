import { Injectable, BadRequestException } from '@nestjs/common';
import https from 'https';

interface CulqiChargeResult {
  id: string;
  outcome: { type: string };
}

@Injectable()
export class CulqiService {
  private readonly secretKey = process.env.CULQI_SECRET_KEY || '';

  async createCharge(params: {
    amount: number;
    currency: string;
    email: string;
    sourceId: string;
    description: string;
  }): Promise<CulqiChargeResult> {
    const body = JSON.stringify({
      amount: params.amount,
      currency_code: params.currency,
      email: params.email,
      source_id: params.sourceId,
      description: params.description,
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.culqi.com',
          path: '/v2/charges',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            const parsed = JSON.parse(data);
            if (res.statusCode && res.statusCode >= 400) {
              reject(new BadRequestException(parsed.user_message || 'Error al procesar el pago con Culqi'));
            } else {
              resolve(parsed);
            }
          });
        },
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}
