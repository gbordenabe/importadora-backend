import { PartialType } from '@nestjs/swagger';
import { CreateDepositDto } from '../create/create-deposit.dto';
import { IsEmpty } from 'class-validator';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  @IsEmpty()
  file_field_name?: string;
}
