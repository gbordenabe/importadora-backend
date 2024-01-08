import { IsString } from "class-validator";

export class CreateClienteDto {

    @IsString()
    name: string;

    @IsString()
    businessName: string;

    /*eliminar porque es auto increment */
    @IsString()
    number_client: string;

    @IsString()
    cuit_cuil: string;

    @IsString()
    city: string;

    @IsString()
    location: string;

    @IsString()
    province: string;

}
