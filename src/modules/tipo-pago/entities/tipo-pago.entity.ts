import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo-pago')
export class TipoPago {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  tipo: string;



  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
