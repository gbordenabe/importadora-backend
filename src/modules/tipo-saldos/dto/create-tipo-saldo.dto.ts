import { IsString } from 'class-validator';

export class CreateTipoSaldoDto {
  @IsString()
  tipo: string;
}
