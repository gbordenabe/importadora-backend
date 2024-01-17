import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoTransaccionDto } from './create-estado-transaccion.dto';
import { IsBoolean } from 'class-validator';

export class UpdateEstadoTransaccionDto extends PartialType(
  CreateEstadoTransaccionDto,
) {
  @IsBoolean()
  isActive: boolean;
}
