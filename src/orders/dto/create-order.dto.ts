import { IsString, IsEmail, IsInt, IsArray, ValidateNested, Min } from 'class-validator';
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

  // El total lo calcula el servidor con precios oficiales (no se confía en el cliente)
}
