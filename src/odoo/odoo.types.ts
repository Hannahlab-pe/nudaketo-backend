export interface OdooLineItem {
  productId: number;
  sizeId: string;
  name: string;
  qty: number;
  price: number;
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
  culqiChargeId?: string | null;
}
