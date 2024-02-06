import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';
import { CreatePaymentDto } from './classes/create-payment.class';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';

export class CreateDepositDto implements CreatePaymentDto {
  @ApiProperty({ maxLength: 25 })
  @IsString()
  @MaxLength(25)
  document_number: string;

  @ApiProperty({ description: 'numeric(10, 2)' })
  @IsNumeric({ precision: 10, maxDecimalPlaces: 2 })
  amount: number;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiPropertyOptional({ maxLength: 500, nullable: true })
  @IsString()
  @MaxLength(500)
  @AllowNulls()
  @IsOptional()
  observation: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  bank_name: string;
}
