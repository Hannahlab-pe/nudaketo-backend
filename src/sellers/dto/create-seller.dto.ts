import { IsEmail, IsString, MinLength, IsNumber, Min, Max } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  code: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPct: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  commissionPct: number;
}
