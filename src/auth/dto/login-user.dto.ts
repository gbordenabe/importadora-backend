import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ maxLength: 100 })
  @MaxLength(100)
  @IsString()
  user_name_or_email: string;

  @ApiProperty({ maxLength: 50, minLength: 8 })
  @IsString()
  @Length(8, 50)
  password: string;
}
