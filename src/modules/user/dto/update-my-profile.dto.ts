import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ maxLength: 100, uniqueItems: true, minLength: 3 })
  @IsString()
  @Length(3, 100)
  @IsOptional()
  user_name: string;

  //email 100 unique optional
  @ApiPropertyOptional({ maxLength: 100, uniqueItems: true, nullable: true })
  @IsEmail()
  @MaxLength(100)
  @IsOptional()
  @AllowNulls()
  email?: string;

  //password 50, 8
  @ApiPropertyOptional({ maxLength: 50, minLength: 8 })
  @IsString()
  @Length(8, 50)
  @IsOptional()
  password: string;

  //name 100 not null
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name: string;

  //last_name 100 not null
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  last_name: string;

  //city 100 nullable
  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @AllowNulls()
  city?: string;

  //location 100 nullable
  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @AllowNulls()
  location?: string;

  //province 100 nullable
  @ApiPropertyOptional({ maxLength: 100, nullable: true })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  @AllowNulls()
  province?: string;
}
