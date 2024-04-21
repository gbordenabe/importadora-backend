import { PartialType } from '@nestjs/swagger';
import { CreateCheckDto } from '../create/create-check.dto';
import { IsEmpty } from 'class-validator';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {
  /* @IsEmpty() */
  file_field_name?: string;
}
