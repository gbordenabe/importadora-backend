import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoSaldoDto } from './create-tipo-saldo.dto';

export class UpdateTipoSaldoDto extends PartialType(CreateTipoSaldoDto) {}
