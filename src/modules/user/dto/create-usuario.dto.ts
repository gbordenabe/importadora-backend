import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
import { AllowNulls } from 'src/common/decorators/allow-null.decorator';

export class CreateUserDto {
  @ApiProperty({ maxLength: 100, uniqueItems: true, minLength: 3 })
  @IsString()
  @Length(3, 100)
  user_name: string;

  //email 100 unique optional
  @ApiPropertyOptional({ maxLength: 100, uniqueItems: true, nullable: true })
  @IsEmail()
  @MaxLength(100)
  @IsOptional()
  @AllowNulls()
  email?: string;

  //password 50, 8
  @ApiProperty({ maxLength: 50, minLength: 8 })
  @IsString()
  @Length(8, 50)
  password: string;

  //name 100 not null
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  //last_name 100 not null
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
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

  //role_id integer min 1
  @ApiProperty({ type: 'integer', minimum: 1 })
  @IsInt()
  @Min(1)
  role_id: number;
}
