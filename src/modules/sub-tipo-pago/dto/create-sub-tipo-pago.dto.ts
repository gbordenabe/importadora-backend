import { IsString, Length } from 'class-validator';

export class CreateSubTipoPagoDto {
  @IsString()
  @Length(4, 255, {
    message:
      'El nombre debe tener al menos 4 carácter y como máximo 255 caracteres',
  })
  subTipo: string;
}
