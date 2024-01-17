import { IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  name: string;

  @IsString()
  businessName: string;

  @IsString()
  cuit_cuil: string;

  @IsString()
  city: string;

  @IsString()
  location: string;

  @IsString()
  province: string;
}
