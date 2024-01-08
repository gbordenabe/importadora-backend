import { IsString } from "class-validator";

export class CreateEmpresaDto {
    @IsString()
    number: string;

    @IsString()
    name: string;

    @IsString()
    abbreviation: string;
}
