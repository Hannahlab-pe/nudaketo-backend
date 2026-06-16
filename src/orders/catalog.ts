/**
 * Catálogo de precios AUTORITATIVO (fuente de verdad en el servidor).
 * Nunca se confía en el precio que envía el cliente: el total se recalcula
 * acá para evitar manipulación del monto a cobrar.
 *
 * Estructura: { [productId]: { [sizeId]: precioEnSoles } }
 * Debe mantenerse en sincronía con src/data/products.js del frontend.
 */
export const CATALOG: Record<number, Record<string, number>> = {
  1: { ind: 8.5, pack: 25.0 }, // Galletón Chips & Almendras
  2: { ind: 8.5, pack: 25.0 }, // Galletón Doble Cacao
  3: { ind: 8.5, pack: 25.0 }, // Galletón Vainilla Chips
  4: { ind: 10.0 }, // Cacao Nuts Bar
  5: { 'pack-141': 28.0, 'pack-70': 14.0 }, // Keto Bites Almendras & Sal
  6: { ind: 8.5, pack: 25.0 }, // Galletón Cacao Nibs
  7: { ind: 10.0 }, // Almond Bar
};

/** Devuelve el precio oficial de un item o null si no existe. */
export function getOfficialPrice(productId: number, sizeId: string): number | null {
  return CATALOG[productId]?.[sizeId] ?? null;
}
