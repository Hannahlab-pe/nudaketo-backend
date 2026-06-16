import {
  IsString,
  IsEmail,
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  productId: number;

  @IsString()
  sizeId: string;

  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  qty: number;

  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  culqiToken: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  // Entrega: recojo en tienda o envío a domicilio
  @IsIn(['PICKUP', 'DELIVERY'])
  fulfillment: 'PICKUP' | 'DELIVERY';

  // Zona de envío (solo si DELIVERY). El costo se calcula en el servidor.
  @IsOptional()
  @IsString()
  zone?: string;

  // Datos de envío (requeridos si DELIVERY)
  @IsOptional() @IsString() customerName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() reference?: string;
  @IsOptional() @IsString() mapsLink?: string;

  // El total (productos + envío) lo calcula el servidor, no se confía en el cliente.
}
