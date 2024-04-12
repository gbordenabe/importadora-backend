import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { BasicQueryParams } from 'src/common/dto/basiq-query-params.dto';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { CLIENT_ORDER_BY_ENUM } from './enum/client-order-by.enum';

export class FindAllClientsQueryDto extends BasicQueryParams {
  @ApiPropertyOptional({ description: 'Filter by name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameFilter: string;

  //order and order_by
  @ApiPropertyOptional({
    enum: CLIENT_ORDER_BY_ENUM,
  })
  @IsEnum(CLIENT_ORDER_BY_ENUM)
  @IsOptional()
  order_by: CLIENT_ORDER_BY_ENUM;

  @ApiPropertyOptional({ enum: ORDER_ENUM, default: ORDER_ENUM.ASC })
  @IsEnum(ORDER_ENUM)
  @IsOptional()
  order: ORDER_ENUM;
}
