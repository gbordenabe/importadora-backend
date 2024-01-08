import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoFacturaDto } from '../create/create-tipo-factura.dto';

export class UpdateTipoFacturaDto extends PartialType(CreateTipoFacturaDto) {}
