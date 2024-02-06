import { PartialType } from '@nestjs/swagger';
import { CreateCreditNoteDto } from '../create/create-credit-note.dto';

export class UpdateCreditNoteDto extends PartialType(CreateCreditNoteDto) {}
