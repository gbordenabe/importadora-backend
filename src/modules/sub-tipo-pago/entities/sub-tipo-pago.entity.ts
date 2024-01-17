import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sub-tipo-pago')
export class SubTipoPago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  subTipo: string;

  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
