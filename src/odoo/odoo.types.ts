import { NormalizedReceipt } from '../orders/receipt';

export interface OdooLineItem {
  productId: number;
  sizeId: string;
  name: string;
  qty: number;
  price: number;
}

export interface OdooProductSize {
  sizeKey: string;
  label: string;
  price: number;
}

export interface OdooProductPayload {
  productId: number;
  name: string;
  description?: string | null;
  shortDesc?: string | null;
  sizes: OdooProductSize[];
  imageId?: string | null;
  stock?: number | null;
}

export interface OdooOrderPayload {
  nudaketoOrderId: string;
  customerEmail: string;
  customerName?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  items: OdooLineItem[];
  totalCents: number;
  // Lo que se cobró además de los productos: Odoo lo necesita para que el comprobante cuadre con Culqi
  shippingCents?: number;
  discountPct?: number;
  receipt?: NormalizedReceipt;
  culqiChargeId?: string | null;
}
