import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsEmail()
    @MinLength(1)
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

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
