import { PartialType } from '@nestjs/mapped-types';
import { CreateSubTipoPagoDto } from './create-sub-tipo-pago.dto';

export class UpdateSubTipoPagoDto extends PartialType(CreateSubTipoPagoDto) {}
