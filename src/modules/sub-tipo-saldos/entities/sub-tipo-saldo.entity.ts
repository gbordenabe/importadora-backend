import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sub-tipo-saldo')
export class SubTipoSaldo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  subTipo: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
