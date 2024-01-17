import { IsUUID } from 'class-validator';
import { Column } from 'typeorm';

export class CreateUsuarioDto {
  @Column()
  @IsUUID()
  idCliente: string;

  @Column()
  @IsUUID()
  idEmpresa: string;
}
