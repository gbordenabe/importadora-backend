import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ type: String, maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ type: String, maxLength: 3 })
  @IsString()
  @MaxLength(3)
  acronym: string;
}
