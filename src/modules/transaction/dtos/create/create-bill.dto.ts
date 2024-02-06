import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsString, MaxLength } from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';
import { IsNumeric } from 'src/common/decorators/is_numeric.decorator';

export class CreateBillDto {
  @ApiProperty({ maxLength: 20 })
  @IsString()
  @MaxLength(20)
  number: string;

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
  observation: string;
}
