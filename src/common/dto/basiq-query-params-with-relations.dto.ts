import { IsBooleanString, IsInt, IsOptional, Max, Min } from 'class-validator';
import BooleanString from '../interfaces/boolean-string.interface';
import { ApiProperty } from '@nestjs/swagger';
//import { IsOneDefined } from '../decorators/is-one-defined.decorator';

export class BasicQueryParamsWithRelations {
  @ApiProperty({ required: false, default: process.env.PAGE, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
    default: process.env.PAGE_SIZE,
    minimum: 1,
    maximum: 200,
  })
  @IsInt()
  @Min(1)
  @Max(200)
  @IsOptional()
  page_size: number;

  // @ApiProperty({
  //   required: false,
  //   enum: ['true', 'false', '1', '0'],
  //   description: `If you send it, return all registers without pagination. Cannot use at the same time that page and page_size query params`,
  // })
  // @IsOneDefined(['all', 'page'])
  // @IsOneDefined(['all', 'page_size'])
  // @IsBooleanString()
  // @IsOptional()
  // all: BooleanString | boolean;

  @ApiProperty({
    required: false,
    enum: ['true', 'false', '1', '0'],
    description: `If you send it, return all registers with their relations`,
  })
  @IsBooleanString()
  @IsOptional()
  relations: BooleanString | boolean;
}
