import { PartialType } from '@nestjs/swagger';
import { CreateRetentionDto } from '../create/create-retention.dto';

export class UpdateRetentionDto extends PartialType(CreateRetentionDto) {}
