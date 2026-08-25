/**
 * Reglas de envío (fuente de verdad en el servidor).
 *
 * Los PRECIOS de producto ya no viven acá: se leen de la tabla Product, que
 * es lo que edita el admin desde el panel. Antes estaban hardcodeados en este
 * archivo y había que mantenerlos sincronizados a mano con el frontend, lo
 * que provocó que los productos nuevos no se pudieran comprar.
 */

// Envío gratis por compras (subtotal de productos) de este monto o más
export const FREE_SHIPPING_THRESHOLD_CENTS = 10000; // S/100

/**
 * Zonas de envío con su costo en soles.
 * Mantener en sincronía con SHIPPING_ZONES del frontend (CheckoutPage).
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
