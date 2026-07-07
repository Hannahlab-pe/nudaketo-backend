/**
 * Catálogo de precios AUTORITATIVO (fuente de verdad en el servidor).
 * Nunca se confía en el precio que envía el cliente: el total se recalcula
 * acá para evitar manipulación del monto a cobrar.
 *
 * Estructura: { [productId]: { [sizeId]: precioEnSoles } }
 * Debe mantenerse en sincronía con src/data/products.js del frontend.
 */
export const CATALOG: Record<number, Record<string, number>> = {
  1: { ind: 9.9, pack: 28.5 }, // Galletón Chips & Almendras
  2: { ind: 9.9, pack: 28.5 }, // Galletón Doble Cacao
  3: { ind: 9.9, pack: 28.5 }, // Galletón Vainilla Chips
  4: { ind: 10.9 }, // Cacao Nuts Bar
  5: { 'pack-141': 31.9, 'pack-70': 15.9 }, // Keto Bites Almendras & Sal
  6: { ind: 9.9, pack: 28.5 }, // Galletón Cacao Nibs
  7: { ind: 10.9 }, // Almond Bar
};

// Envío gratis por compras (subtotal de productos) de este monto o más
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000; // S/100

/** Devuelve el precio oficial de un item o null si no existe. */
export function getOfficialPrice(productId: number, sizeId: string): number | null {
  return CATALOG[productId]?.[sizeId] ?? null;
}

/**
 * Zonas de envío con su costo en soles (fuente de verdad en el servidor).
 * Mantener en sincronía con el front (CartDrawer SHIPPING_ZONES).
 */
export const SHIPPING_ZONES: Record<string, number> = {
  lima: 9.5, // Lima Metropolitana
  provincia: 20,
};

/**
 * Costo de envío en céntimos, calculado en el servidor (anti-manipulación).
 * Recojo en tienda = gratis. Envío gratis si el subtotal supera el umbral.
 */
export function getShippingCents(
  fulfillment: 'PICKUP' | 'DELIVERY',
  zone: string | undefined,
  itemsCents: number,
): number {
  if (fulfillment === 'PICKUP') return 0;
  if (itemsCents >= FREE_SHIPPING_THRESHOLD_CENTS) return 0;
  const soles = (zone && SHIPPING_ZONES[zone]) || 9.5;
  return Math.round(soles * 100);
}
