import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BasicQueryParams } from 'src/common/dto/basiq-query-params.dto';
import { COMPANY_ORDER_BY_ENUM } from './enum/company-order-by.enum';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';

export class FindAllCompaniesQueryDto extends BasicQueryParams {
  @ApiPropertyOptional({ description: 'Filter by name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameFilter: string;

  //order and order_by
  @ApiPropertyOptional({
    enum: COMPANY_ORDER_BY_ENUM,
    default: COMPANY_ORDER_BY_ENUM.ID,
  })
  @IsEnum(COMPANY_ORDER_BY_ENUM)
  @IsOptional()
  order_by: COMPANY_ORDER_BY_ENUM;

  @ApiPropertyOptional({ enum: ORDER_ENUM, default: ORDER_ENUM.ASC })
  @IsEnum(ORDER_ENUM)
  @IsOptional()
  order: ORDER_ENUM;
}
