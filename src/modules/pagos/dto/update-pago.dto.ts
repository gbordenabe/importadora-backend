import { PartialType } from '@nestjs/mapped-types';
import { CreatePagoDto } from './create-pago.dto';
import { IsBoolean } from 'class-validator';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {

}
