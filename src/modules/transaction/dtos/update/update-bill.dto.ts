import { PartialType } from '@nestjs/swagger';
import { CreateBillDto } from '../create/create-bill.dto';

export class UpdateBillDto extends PartialType(CreateBillDto) {}
