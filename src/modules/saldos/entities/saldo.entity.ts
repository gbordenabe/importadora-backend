import { SubTipoSaldo } from 'src/modules/sub-tipo-saldos/entities/sub-tipo-saldo.entity';
import { TipoSaldo } from 'src/modules/tipo-saldos/entities/tipo-saldo.entity';
import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('saldo')
export class Saldo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  porcentaje: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'text' })
  obs: string;

  @ManyToOne(() => TipoSaldo)
  tipoPago: TipoSaldo;

  @ManyToOne(() => SubTipoSaldo)
  subTipoPago: SubTipoSaldo;

  @ManyToOne(() => Transaccion, (transaccion) => transaccion.saldo)
  transacciones: Transaccion;

  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
