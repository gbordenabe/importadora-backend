import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from '../create/create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
