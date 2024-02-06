import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CHECK_TYPE_ENUM } from '../../entities/enum/check-type.enum';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';
import { CreatePaymentDto } from './classes/create-payment.class';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';

export class CreateCheckDto implements CreatePaymentDto {
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

  @ApiProperty({ enum: CHECK_TYPE_ENUM })
  @IsEnum(CHECK_TYPE_ENUM)
  type: CHECK_TYPE_ENUM;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  bank_name: string;
}
