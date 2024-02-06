import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class RecoverPasswordByEmailDto {
  @ApiProperty({ maxLength: 250 })
  @IsString()
  @MaxLength(250)
  code: string;

  @ApiProperty({ maxLength: 250 })
  @IsEmail()
  @MaxLength(250)
  email: string;

  @ApiProperty({ minLength: 3, maxLength: 50 })
  @IsString()
  @Length(3, 50)
  new_password: string;
}
