import { Factura } from 'src/modules/factura/entities/factura.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TipoFactura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Factura, (factura) => factura.tipoFact)
  factura: Factura;

  @Column({ type: 'bool' })
  isActive: boolean;
}
