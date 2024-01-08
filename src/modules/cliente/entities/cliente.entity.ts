import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  businessName: string;

  /*Colocarle el auto increment*/
  @Column()
  number_client: string;

  @Column()
  cuit_cuil: string;

  @Column()
  city: string;

  @Column()
  location: string;

  @Column()
  province: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateUpdate: Date | null;

  @Column({ type: 'timestamp', default: null })
  dateDelete: Date | null;

  @OneToMany(
    () => Transaccion, 
    (transaccion) => transaccion.cliente)
  transacciones: Transaccion;
}
