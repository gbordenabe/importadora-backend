import { IsString } from 'class-validator';

export class CreateSubTipoSaldoDto {
  @IsString()
  subTipo: string;
}
