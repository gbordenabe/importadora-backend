import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado-transaccion')
export class EstadoTransaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  obs: string;

  @Column({ type: 'text' })
  color: string;

  @ManyToOne(() => Transaccion, (transaccion) => transaccion.saldo)
  transacciones: Transaccion;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
