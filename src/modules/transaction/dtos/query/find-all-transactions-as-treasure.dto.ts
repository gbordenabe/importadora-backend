import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { FindAllTransactionsDto } from './find-all-transactions.dto';

export class FindAllTransactionsAsTreasureDto extends FindAllTransactionsDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: 1,
    isArray: true,
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsOptional()
  sellers: number[];
}
