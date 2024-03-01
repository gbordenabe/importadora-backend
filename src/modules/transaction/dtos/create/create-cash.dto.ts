import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePaymentDto } from './classes/create-payment.class';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class CreateCashDto implements CreatePaymentDto {
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

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  file_field_name: string;
}
