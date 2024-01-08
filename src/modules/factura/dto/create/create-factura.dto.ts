import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateFacturaDto {

    @IsString()
    number: string;

    @IsNumber()
    amount: number;

    @IsString()
    @IsOptional()
    obs?: string;

    @IsString()
    @IsOptional()
    state: string;

    @IsUUID()
    transaccionId: string;

    @IsUUID()
    tipoFacturaId: string;
}
