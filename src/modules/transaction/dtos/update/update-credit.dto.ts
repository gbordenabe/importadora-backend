import { PartialType } from '@nestjs/swagger';
import { CreateCreditDto } from '../create/create-credit.dto';

export class UpdateCreditDto extends PartialType(CreateCreditDto) {}
