import { Cliente } from 'src/modules/cliente/entities/cliente.entity';
import { Empresa } from 'src/modules/empresa/entities/empresa.entity';
import { Factura } from 'src/modules/factura/entities/factura.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type:'text'})
  sku: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateUpdate: Date | null;

  @Column({ type: 'timestamp', default: null })
  dateDelete: Date | null;

  @ManyToOne(
    () => Cliente, 
    (cliente) => cliente.transacciones)
  cliente: Cliente;

  @ManyToOne(
    () => Empresa, 
    (empresa) => empresa.transacciones)
  empresa: Empresa;

  @OneToMany(
    () => Factura, 
    (factura) => factura.transacciones)
    factura?: Factura[];
}
