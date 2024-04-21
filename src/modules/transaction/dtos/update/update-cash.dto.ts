import { PartialType } from '@nestjs/swagger';
import { CreateCashDto } from '../create/create-cash.dto';
import { IsEmpty } from 'class-validator';

export class UpdateCashDto extends PartialType(CreateCashDto) {
  /* @IsEmpty() */
  file_field_name?: string;
}
