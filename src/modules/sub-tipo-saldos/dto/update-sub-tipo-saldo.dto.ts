import { PartialType } from '@nestjs/mapped-types';
import { CreateSubTipoSaldoDto } from './create-sub-tipo-saldo.dto';

export class UpdateSubTipoSaldoDto extends PartialType(CreateSubTipoSaldoDto) {}
