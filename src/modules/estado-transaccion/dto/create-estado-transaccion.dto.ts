import { IsString } from 'class-validator';

export class CreateEstadoTransaccionDto {
  @IsString()
  title: string;
  @IsString()
  obs: string;
  @IsString()
  color: string;
}
