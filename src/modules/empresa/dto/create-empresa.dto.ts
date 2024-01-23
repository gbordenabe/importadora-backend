import { IsOptional, IsString } from "class-validator";

export class CreateEmpresaDto {
    @IsString()
    @IsOptional()
    number: string;

    @IsString()
    name: string;

    @IsString()
    abbreviation: string;
}
