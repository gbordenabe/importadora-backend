import { PartialType } from '@nestjs/swagger';
import { CreateRetentionDto } from '../create/create-retention.dto';
import { IsEmpty } from 'class-validator';

export class UpdateRetentionDto extends PartialType(CreateRetentionDto) {
  /* @IsEmpty() */
  file_field_name?: string;
}
