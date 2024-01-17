import { TipoFactura } from 'src/modules/tipo-factura/entities/tipo-factura.entity';
import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  number: string;

  @Column({ type: 'decimal', scale: 2, default: 0.0 })
  amount: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
  @Column()
  obs?: string;

  @Column({ type: 'text', default: 'Sin revisar' })
  state: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateUpdate: Date | null;

  @Column({ type: 'timestamp', default: null })
  dateDelete: Date | null;

  @ManyToOne(() => Transaccion, (transaccion) => transaccion.factura)
  transacciones: Transaccion;

  @ManyToOne(() => TipoFactura, (tipoFact) => tipoFact.factura)
  tipoFact: TipoFactura;
}
