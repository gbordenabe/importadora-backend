import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsString()
  @MinLength(1)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsOptional()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString({ message: 'Tipo_Usuario debe ser una cadena de texto' })
  @IsIn(['CLIENTE', 'TESORERO', 'EMPRESA', 'VENDEDOR'], {
    message:
      'Tipo_Usuario debe ser "CLIENTE", "TESORERO", "EMPRESA" o "VENDEDOR"',
  })
  Tipo_Usuario: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  province: string;
}
