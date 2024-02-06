import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class ItemRequestToChangeDto {
  @ApiPropertyOptional({
    maxLength: 500,
    nullable: true,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  @AllowNulls()
  request_change_comment: string;
}
