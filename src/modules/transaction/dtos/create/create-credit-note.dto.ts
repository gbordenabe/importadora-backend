import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBalanceDto } from './classes/create-balance.class';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';
import { IsDate, IsOptional, IsString, MaxLength } from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class CreateCreditNoteDto implements CreateBalanceDto {
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

  @ApiProperty({ description: 'numeric(5, 2)' })
  @IsNumeric({ precision: 5, maxDecimalPlaces: 2 })
  porcentage: number;
}
