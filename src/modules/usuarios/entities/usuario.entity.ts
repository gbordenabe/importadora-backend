
import { Cliente } from 'src/modules/cliente/entities/cliente.entity';
import { Empresa } from 'src/modules/empresa/entities/empresa.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cliente)
  user: Cliente;

  @ManyToOne(() => Empresa)
  empresa: Empresa;

  @Column({ type: 'boolean', default: true })
  isActive: boolean
}
