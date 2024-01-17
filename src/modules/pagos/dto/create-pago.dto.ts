import {
  IsNumber,
  IsString,
  IsBoolean,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  numero: number;

  @IsOptional()
  @IsString()
  banco: string;

  @IsNumber()
  monto: number;

  @IsString()
  fecha: string;

  @IsString()
  adjunto: string;

  @IsString()
  obs: string;

  @IsOptional()
  @IsBoolean()
  estado: boolean;

  @IsUUID()
  idTipoPago: string;

  @IsOptional()
  @IsUUID()
  idSubTipoPago: string;
}
