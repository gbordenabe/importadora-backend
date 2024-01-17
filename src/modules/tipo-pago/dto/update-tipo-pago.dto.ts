import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoPagoDto } from './create-tipo-pago.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTipoPagoDto extends PartialType(CreateTipoPagoDto) {
  @IsBoolean()
  isActive: boolean;
}
