import { ApiPropertyOptional } from '@nestjs/swagger';
import { TRANSACTION_STATUS_ENUM } from '../../entities/enum/transaction-status-.enum';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { TRANSACTION_ORDER_BY_ENUM } from '../enum/transaction-order-by.enum';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';
import { EmptyToUndefined } from 'src/common/decorators/empty-to-undefined.decorator';

export class FindAllTransactionsDto {
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
    isArray: true,
    maxItems: Object.keys(TRANSACTION_STATUS_ENUM).length,
  })
  @IsEnum(TRANSACTION_STATUS_ENUM, { each: true })
  @IsArray()
  @ArrayMaxSize(Object.keys(TRANSACTION_STATUS_ENUM).length)
  @IsOptional()
  statuses: TRANSACTION_STATUS_ENUM[] = [];

  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  bill_status: TRANSACTION_STATUS_ENUM;

  //cash_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  cash_status: TRANSACTION_STATUS_ENUM;

  //check_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  check_status: TRANSACTION_STATUS_ENUM;

  //credit_note_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  credit_note_status: TRANSACTION_STATUS_ENUM;

  //credit_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  credit_status: TRANSACTION_STATUS_ENUM;

  //deposit_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  deposit_status: TRANSACTION_STATUS_ENUM;

  //retention_status
  @ApiPropertyOptional({
    enum: TRANSACTION_STATUS_ENUM,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_STATUS_ENUM)
  @IsOptional()
  retention_status: TRANSACTION_STATUS_ENUM;

  @ApiPropertyOptional()
  @EmptyToUndefined()
  @IsDateString()
  @IsOptional()
  created_at_start: string;

  @ApiPropertyOptional()
  @EmptyToUndefined()
  @IsDateString()
  @IsOptional()
  created_at_end: string;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    isArray: true,
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @IsOptional()
  companies: number[] = [];

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    isArray: true,
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @IsOptional()
  clients: number[] = [];

  @ApiPropertyOptional({
    maxLength: 25,
    description:
      'Alguna transacción con este número de documento en los cheques',
  })
  @EmptyToUndefined()
  @IsString()
  @MaxLength(25)
  @IsOptional()
  check_document_number: string;

  @ApiPropertyOptional({
    maxLength: 20,
    description: 'Alguna transacción con este número de factura',
  })
  @EmptyToUndefined()
  @IsString()
  @MaxLength(20)
  @IsOptional()
  bill_number: string;

  //cash_document_number
  @ApiPropertyOptional({
    maxLength: 25,
    description: 'Alguna transacción con este número de documento en EFECTIVOS',
  })
  @EmptyToUndefined()
  @IsString()
  @MaxLength(25)
  @IsOptional()
  cash_document_number: string;

  //deposit_document_number
  @ApiPropertyOptional({
    maxLength: 25,
    description: 'Alguna transacción con este número de documento en DEPOSITOS',
  })
  @EmptyToUndefined()
  @IsString()
  @MaxLength(25)
  @IsOptional()
  deposit_document_number: string;

  //monto minimo en facturas
  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en facturas, se buscaran las transacciones con minimo una factura con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  bill_amount_min: number;

  //monto minimo en pagos
  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en pagos, se buscaran las transacciones con minimo un cheque con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  check_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  total_amount_min: number;

  //monto minimo en balance
  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en balance, se buscaran las transacciones con minimo un deposito con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  deposit_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en balance, se buscaran las transacciones con minimo un EFECTIVO con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  cash_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en pagos, se buscaran las transacciones con minimo un credito con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  credit_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en pagos, se buscaran las transacciones con minimo una nota de credito con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  credit_note_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
    description:
      'Monto minimo en pagos, se buscaran las transacciones con minimo una retencion con monto mayor o igual a este. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  retention_amount_min: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Monto total de la transacción. numeric(10, 2)',
  })
  @EmptyToUndefined()
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
  @IsOptional()
  total_amount: number;

  @ApiPropertyOptional({
    enum: ORDER_ENUM,
    default: ORDER_ENUM.ASC,
  })
  @EmptyToUndefined()
  @IsEnum(ORDER_ENUM)
  @IsOptional()
  order: ORDER_ENUM;

  @ApiPropertyOptional({
    enum: TRANSACTION_ORDER_BY_ENUM,
    default: TRANSACTION_ORDER_BY_ENUM.ID,
  })
  @EmptyToUndefined()
  @IsEnum(TRANSACTION_ORDER_BY_ENUM)
  @IsOptional()
  order_by: TRANSACTION_ORDER_BY_ENUM;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    isArray: true,
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @IsOptional()
  sellers: number[] = [];
}
