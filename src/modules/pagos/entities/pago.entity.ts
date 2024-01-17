import { SubTipoPago } from 'src/modules/sub-tipo-pago/entities/sub-tipo-pago.entity';
import { TipoPago } from 'src/modules/tipo-pago/entities/tipo-pago.entity';
import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('pago')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision' })
  numero: number;

  @Column({ type: 'text' })
  banco: string;

  @Column({ type: 'double precision' })
  monto: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'text' })
  adjunto: string;

  @Column({ type: 'text' })
  obs: string;

  @Column({ type: 'boolean' })
  estado: boolean;

  @ManyToOne(() => TipoPago)
  tipoPago: TipoPago;

  @ManyToOne(() => SubTipoPago)
  subTipoPago: SubTipoPago;

  @ManyToOne(() => Transaccion, (transaccion) => transaccion.pago)
  transacciones: Transaccion;

  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
