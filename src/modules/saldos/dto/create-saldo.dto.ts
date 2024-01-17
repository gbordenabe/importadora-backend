import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSaldoDto {
  @IsNumber()
  monto: number;

  @IsOptional()
  @IsNumber()
  porcentaje: number;

  @IsString()
  fecha: string;

  @IsString()
  obs: string;

  @IsString()
  idTipoPago: string;

  @IsString()
  idSubTipoPago: string;
}
