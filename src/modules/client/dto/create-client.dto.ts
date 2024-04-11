import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class CreateClientDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  business_name?: string;

  //client 100 nullable unique
  @ApiPropertyOptional({ maxLength: 100, nullable: true, uniqueItems: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  client_number?: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  cuit_cuil?: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @AllowNulls()
  @IsOptional()
  province?: string;
}
