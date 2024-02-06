import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBillDto } from './create-bill.dto';
import { Type } from 'class-transformer';
import { CreateCashDto } from './create-cash.dto';
import { CreateCheckDto } from './create-check.dto';
import { CreateCreditNoteDto } from './create-credit-note.dto';
import { CreateCreditDto } from './create-credit.dto';
import { CreateDepositDto } from './create-deposit.dto';
import { CreateRetentionDto } from './create-retention.dto';

export class CreateTransactionDto {
  @ApiProperty({ maxLength: 50, uniqueItems: true })
  @MaxLength(50)
  @IsString()
  sku: string;

  @ApiProperty({ type: 'integer', minimum: 1 })
  @IsInt()
  @Min(1)
  companyId: number;

  @ApiProperty({ type: 'integer', minimum: 1 })
  @IsInt()
  @Min(1)
  clientId: number;

  @ApiProperty({ type: () => [CreateBillDto] })
  @Type(() => CreateBillDto)
  @ValidateNested({ each: true })
  @IsArray()
  bills: CreateBillDto[];

  @ApiProperty({ type: () => [CreateCashDto] })
  @Type(() => CreateCashDto)
  @ValidateNested({ each: true })
  @IsArray()
  cash: CreateCashDto[];

  @ApiProperty({ type: () => [CreateCheckDto] })
  @Type(() => CreateCheckDto)
  @ValidateNested({ each: true })
  @IsArray()
  checks: CreateCheckDto[];

  @ApiProperty({ type: () => [CreateCreditNoteDto] })
  @Type(() => CreateCreditNoteDto)
  @ValidateNested({ each: true })
  @IsArray()
  credit_notes: CreateCreditNoteDto[];

  @ApiProperty({ type: () => [CreateCreditDto] })
  @Type(() => CreateCreditDto)
  @ValidateNested({ each: true })
  @IsArray()
  credits: CreateCreditDto[];

  @ApiProperty({ type: () => [CreateDepositDto] })
  @Type(() => CreateDepositDto)
  @ValidateNested({ each: true })
  @IsArray()
  deposits: CreateDepositDto[];

  @ApiProperty({ type: () => [CreateRetentionDto] })
  @Type(() => CreateRetentionDto)
  @ValidateNested({ each: true })
  @IsArray()
  retentions: CreateRetentionDto[];
}
