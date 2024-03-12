import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBalanceDto } from './classes/create-balance.class';
import { CREDIT_TYPE_ENUM } from '../../entities/enum/credit-type.enum';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';

export class CreateCreditDto implements CreateBalanceDto {
  @ApiProperty({ description: 'numeric(20, 2)' })
  @IsNumeric({ precision: 20, maxDecimalPlaces: 2 })
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

  @ApiProperty({ enum: CREDIT_TYPE_ENUM })
  @IsEnum(CREDIT_TYPE_ENUM)
  type: CREDIT_TYPE_ENUM;
}
