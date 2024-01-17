import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo-saldo')
export class TipoSaldo {
    @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  tipo: string;



  @Column({ type: 'bool', default: true })
  isActive: boolean;
}
