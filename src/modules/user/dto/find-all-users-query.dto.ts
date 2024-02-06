import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { USER_ORDER_BY_ENUM } from './enum/user-order-by.enum';
import { BasicQueryParamsWithRelations } from 'src/common/dto/basiq-query-params-with-relations.dto';

export class FindAllUsersQueryDto extends BasicQueryParamsWithRelations {
  @ApiPropertyOptional({ description: 'Filter by name', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  nameFilter: string;

  //order and order_by
  @ApiPropertyOptional({
    enum: USER_ORDER_BY_ENUM,
    default: USER_ORDER_BY_ENUM.ID,
  })
  @IsEnum(USER_ORDER_BY_ENUM)
  @IsOptional()
  order_by: USER_ORDER_BY_ENUM;

  @ApiPropertyOptional({ enum: ORDER_ENUM, default: ORDER_ENUM.ASC })
  @IsEnum(ORDER_ENUM)
  @IsOptional()
  order: ORDER_ENUM;

  @ApiPropertyOptional({ minimum: 1, type: 'integer' })
  @IsInt()
  @Min(1)
  @IsOptional()
  roleId: number;
}
