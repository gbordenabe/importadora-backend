import { PartialType } from '@nestjs/swagger';
import { CreateDepositDto } from '../create/create-deposit.dto';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {}
