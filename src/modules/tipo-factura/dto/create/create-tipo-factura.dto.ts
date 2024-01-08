import { IsString } from "class-validator";

export class CreateTipoFacturaDto {

    @IsString()
    name: string;
}
