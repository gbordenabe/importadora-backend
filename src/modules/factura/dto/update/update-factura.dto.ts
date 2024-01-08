import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from '../create/create-factura.dto';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {}
