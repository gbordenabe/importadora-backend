import { IsString, Length } from 'class-validator';

export class CreateTipoPagoDto {
  @IsString()
  @Length(4, 255, {
    message:
      'El nombre debe tener al menos 4 carácter y como máximo 255 caracteres',
  })
  tipo: string;
}
