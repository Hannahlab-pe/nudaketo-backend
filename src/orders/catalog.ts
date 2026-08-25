/**
 * Catálogo de precios AUTORITATIVO (fuente de verdad en el servidor).
 * Nunca se confía en el precio que envía el cliente: el total se recalcula
 * acá para evitar manipulación del monto a cobrar.
 *
 * Estructura: { [productId]: { [sizeId]: precioEnSoles } }
 * Debe mantenerse en sincronía con src/data/products.js del frontend.
 */
export const CATALOG: Record<number, Record<string, number>> = {
  // Galletones
  1: { ind: 9.9, pack: 28.5 }, // Galletón Chips & Almendras
  2: { ind: 9.9, pack: 28.5 }, // Galletón Doble Cacao
  3: { ind: 9.9, pack: 28.5 }, // Galletón Vainilla Chips
  6: { ind: 9.9, pack: 28.5 }, // Galletón Cacao Nibs
  // Barras
  4: { ind: 10.9 }, // Cacao Nuts
  7: { ind: 10.9 }, // Almond Bar
  // Keto Bites
  5: { 'pack-141': 31.9, 'pack-70': 15.9 }, // Keto Bites Almendras & Sal
  // Tortas (catálogo 2026)
  8: { porcion: 23, completa: 220 }, // Trufa de Chocolate Keto
  9: { porcion: 21, completa: 197 }, // Torta Keto de Vainilla
  10: { porcion: 21, completa: 195 }, // Chocolate Amargo y Avellana Keto
  11: { porcion: 20, completa: 193 }, // Carrot Cake Keto Clásica
  // Cuchareables (catálogo 2026)
  12: { unico: 28 }, // Pistacho Velvet
  13: { unico: 26 }, // Nuda Rocher
  14: { unico: 26 }, // Alfajor Velvet
  15: { unico: 26 }, // Cheesecake Clásico
  16: { unico: 26 }, // Tiramisú
  17: { unico: 25 }, // Tres Leches Keto
  18: { unico: 25 }, // Carrot Cake Cuchareable
  19: { unico: 21 }, // Mousse de Maracuyá
};

/**
 * Productos que necesitan cadena de frío (tortas y cuchareables).
 * No se pueden enviar a provincia: solo Lima o recojo en tienda.
 * El front ya lo bloquea, pero se valida acá porque el front es manipulable.
 */
export const REFRIGERATED_IDS = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

export function hasRefrigerated(items: { productId: number }[]): boolean {
  return items.some((i) => REFRIGERATED_IDS.has(i.productId));
}

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
