import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  number: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  obs?: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @Transform(({ value }) => value.split('T')[0]) // Elimina la parte de la hora si es un string ISO
  @IsDateString()
  @Validate(
    ({ value }) => {
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      if (!regex.test(value)) {
        return false;
      }

      const parts = value.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      // Verifica si es una fecha válida
      if (
        isNaN(year) ||
        isNaN(month) ||
        isNaN(day) ||
        year < 1000 ||
        year > 9999 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        return false;
      }

      return true;
    },
    { message: 'La fecha debe estar en formato "YYYY-MM-DD" en números.' },
  )
  fecha: string;
  @IsUUID()
  @IsOptional()
  tipoFacturaId?: string;
}
