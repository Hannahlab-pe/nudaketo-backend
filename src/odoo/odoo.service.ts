import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OdooLineItem, OdooOrderPayload } from './odoo.types';

@Injectable()
export class OdooService implements OnModuleInit {
  private readonly logger = new Logger(OdooService.name);
  private uid: number | null = null;

  private readonly enabled: boolean;
  private readonly url: string;
  private readonly db: string;
  private readonly username: string;
  private readonly apiKey: string;
  private readonly websiteId: number;

  constructor(private config: ConfigService) {
    this.enabled = this.config.get('ODOO_ENABLED') === 'true';
    this.url = this.config.get('ODOO_URL') ?? '';
    this.db = this.config.get('ODOO_DB') ?? '';
    this.username = this.config.get('ODOO_USERNAME') ?? '';
    this.apiKey = this.config.get('ODOO_API_KEY') ?? '';
    this.websiteId = Number(this.config.get('ODOO_WEBSITE_ID') ?? 1);
  }

  async onModuleInit() {
    if (!this.enabled) return;
    try {
      const uid = await this.autenticar();
      this.logger.log(`Odoo conectado correctamente — uid: ${uid}`);
    } catch (err) {
      this.logger.error(`No se pudo conectar a Odoo al iniciar: ${err.message}`);
    }
  }

  private async llamar<T>(service: string, method: string, args: unknown[]): Promise<T> {
    const res = await fetch(`${this.url}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: Date.now(),
        params: { service, method, args },
      }),
    });

    if (!res.ok) throw new Error(`Odoo HTTP ${res.status}`);

    const json = (await res.json()) as { result?: T; error?: { message: string; data?: { message: string } } };
    if (json.error) {
      throw new Error(json.error.data?.message ?? json.error.message);
    }
    return json.result as T;
  }

  private async autenticar(): Promise<number> {
    const uid = await this.llamar<number>('common', 'authenticate', [
      this.db, this.username, this.apiKey, {},
    ]);
    if (!uid) throw new Error('Credenciales de Odoo inválidas');
    this.uid = uid;
    return uid;
  }

  private async ejecutar<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
    if (!this.uid) await this.autenticar();
    return this.llamar<T>('object', 'execute_kw', [
      this.db, this.uid, this.apiKey, model, method, args, kwargs,
    ]);
  }

  private async resolverPartnerId(
    email: string,
    name: string,
    phone?: string | null,
    street?: string | null,
    city?: string | null,
  ): Promise<number> {
    const existentes = await this.ejecutar<{ id: number }[]>('res.partner', 'search_read', [
      [['email', '=', email]],
    ], { fields: ['id'], limit: 1 });

    if (existentes.length > 0) {
      await this.ejecutar('res.partner', 'write', [[existentes[0].id], {
        name: name,
        phone: phone ?? false,
        street: street ?? false,
        city: city ?? false,
      }]);
      return existentes[0].id;
    }

    return this.ejecutar<number>('res.partner', 'create', [{
      name,
      email,
      phone: phone ?? false,
      street: street ?? false,
      city: city ?? false,
      customer_rank: 1,
    }]);
  }

  private async resolverProductoId(item: OdooLineItem): Promise<number | null> {
    const ref = `NK-${item.productId}-${item.sizeId}`;

    const porRef = await this.ejecutar<number[]>('product.product', 'search', [
      [['default_code', '=', ref]],
    ], { limit: 1 });
    if (porRef.length > 0) return porRef[0];

    const porNombre = await this.ejecutar<number[]>('product.product', 'search', [
      [['name', 'ilike', item.name]],
    ], { limit: 1 });
    if (porNombre.length > 0) return porNombre[0];

    this.logger.warn(`Producto no encontrado en Odoo: ${ref} / "${item.name}". Creando automáticamente.`);
    const tmplId = await this.ejecutar<number>('product.template', 'create', [{
      name: item.name,
      type: 'consu',
      default_code: ref,
      sale_ok: true,
      purchase_ok: false,
    }]);
    const variantes = await this.ejecutar<{ id: number }[]>('product.product', 'search_read', [
      [['product_tmpl_id', '=', tmplId]],
    ], { fields: ['id'], limit: 1 });

    return variantes[0]?.id ?? null;
  }

  async crearOrdenVenta(payload: OdooOrderPayload): Promise<number> {
    if (!this.enabled) return 0;

    const partnerId = await this.resolverPartnerId(
      payload.customerEmail,
      payload.customerName ?? payload.customerEmail,
      payload.phone,
      payload.address,
      payload.city,
    );

    const saleOrderId = await this.ejecutar<number>('sale.order', 'create', [{
      partner_id: partnerId,
      website_id: this.websiteId,
      client_order_ref: `NK-${payload.nudaketoOrderId}`,
      note: payload.culqiChargeId ? `Culqi: ${payload.culqiChargeId}` : '',
    }]);

    for (const item of payload.items) {
      try {
        const productId = await this.resolverProductoId(item);
        if (!productId) {
          this.logger.warn(`No se pudo resolver producto ${item.name}, se omite la línea`);
          continue;
        }
        await this.ejecutar('sale.order.line', 'create', [{
          order_id: saleOrderId,
          product_id: productId,
          product_uom_qty: item.qty,
          price_unit: item.price,
          name: item.name,
        }]);
      } catch (err) {
        this.logger.error(`Error creando línea "${item.name}" en Odoo: ${err.message}`);
      }
    }

    await this.ejecutar('sale.order', 'action_confirm', [[saleOrderId]]);
    this.logger.log(`Orden Odoo #${saleOrderId} creada y confirmada para NK-${payload.nudaketoOrderId}`);

    return saleOrderId;
  }
}
