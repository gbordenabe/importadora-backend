import { User } from 'src/auth/entities/user.entity';
import { Cliente } from 'src/modules/cliente/entities/cliente.entity';
import { Empresa } from 'src/modules/empresa/entities/empresa.entity';
import { EstadoTransaccion } from 'src/modules/estado-transaccion/entities/estado-transaccion.entity';
import { Factura } from 'src/modules/factura/entities/factura.entity';
import { Pago } from 'src/modules/pagos/entities/pago.entity';
import { Saldo } from 'src/modules/saldos/entities/saldo.entity';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  sku: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateUpdate: Date | null;

  @Column({ type: 'timestamp', default: null })
  dateDelete: Date | null;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;

  @OneToMany(() => Factura, (factura) => factura.transacciones)
  factura?: Factura[];

  @OneToMany(() => Factura, (pago) => pago.transacciones)
  pago?: Pago[];

  @OneToMany(() => Saldo, (saldo) => saldo.transacciones)
  saldo?: Saldo[];

  @OneToMany(() => EstadoTransaccion, (saldo) => saldo.transacciones)
  estadoTransaccion?: EstadoTransaccion[];
}
