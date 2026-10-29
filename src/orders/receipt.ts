import { BadRequestException } from '@nestjs/common';
import { ReceiptDto } from './dto/create-order.dto';

// SUNAT exige identificar al cliente en boletas desde S/ 700.
export const RECEIPT_WITHOUT_ID_LIMIT_CENTS = 70000;

export type ReceiptDocType = 'DNI' | 'CE' | 'RUC';

export interface NormalizedReceipt {
  type: 'BOLETA' | 'FACTURA';
  docType: ReceiptDocType | null;
  docNumber: string | null;
  billingName: string | null;
  billingAddress: string | null;
}

/** Dígito verificador del RUC (algoritmo de SUNAT). */
export function isValidRuc(ruc: string): boolean {
  if (!/^(10|15|16|17|20)\d{9}$/.test(ruc)) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(ruc[i]), 0);
  const rest = 11 - (sum % 11);
  const check = rest === 10 ? 0 : rest === 11 ? 1 : rest;
  return check === Number(ruc[10]);
}

/**
 * Valida y ordena los datos del comprobante antes de cobrar.
 * Factura: RUC válido, razón social y dirección fiscal.
 * Boleta: DNI (8 dígitos) o carné de extranjería (9 a 12 caracteres), obligatorio desde S/ 700.
 */
export function normalizeReceipt(
  receipt: ReceiptDto | undefined,
  totalCents: number,
  fallbackName: string | null,
): NormalizedReceipt {
  const type = receipt?.type ?? 'BOLETA';
  const docNumber = (receipt?.docNumber ?? '').replace(/\s+/g, '').toUpperCase();
  const billingName = receipt?.billingName?.trim() || null;
  const billingAddress = receipt?.billingAddress?.trim() || null;

  if (type === 'FACTURA') {
    if (!isValidRuc(docNumber)) {
      throw new BadRequestException('El RUC no es válido. Revisa los 11 dígitos.');
    }
    if (!billingName) throw new BadRequestException('Para la factura falta la razón social.');
    if (!billingAddress) throw new BadRequestException('Para la factura falta la dirección fiscal.');
    return { type, docType: 'RUC', docNumber, billingName, billingAddress };
  }

  let docType: ReceiptDocType | null = null;
  if (docNumber) {
    if (/^\d{8}$/.test(docNumber)) docType = 'DNI';
    else if (/^[A-Z0-9]{9,12}$/.test(docNumber)) docType = 'CE';
    else throw new BadRequestException('El DNI debe tener 8 dígitos (o 9 a 12 caracteres si es carné de extranjería).');
  } else if (totalCents > RECEIPT_WITHOUT_ID_LIMIT_CENTS) {
    throw new BadRequestException('Para compras de más de S/ 700 SUNAT pide tu DNI o carné de extranjería en la boleta.');
  }

  return {
    type,
    docType,
    docNumber: docNumber || null,
    billingName: docType ? billingName || fallbackName : null,
    billingAddress: null,
  };
}
