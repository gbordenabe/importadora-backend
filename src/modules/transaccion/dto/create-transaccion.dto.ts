import { IsString } from 'class-validator';

export class CreateTransaccionDto {
  @IsString()
  sku: string;
}
