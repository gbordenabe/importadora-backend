import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';



interface FacturaInterface {
  id?:string
  number:string;
  amount:number;
  obs:string;
  idTipoFactura: string;

}
export class CreateTransaccionDto {
  @IsString()
  sku: string;

  @IsUUID()
  clientId: string;

  @IsUUID()
  empresaId: string;


  @IsArray()
  @IsOptional()
  factura?: FacturaInterface[];

}


