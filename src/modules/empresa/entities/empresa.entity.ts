import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Empresa {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  name: string;

  @Column()
  abbreviation: string;

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
    (transaccion) => transaccion.empresa)
  transacciones: Transaccion;
}
