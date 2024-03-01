import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Client {
  @ApiProperty({ uniqueItems: true, type: 'integer' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ maxLength: 100, nullable: true, uniqueItems: true })
  @Column({ length: 100, nullable: true, unique: true })
  client_number: string;

  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  business_name: string;

  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  cuit_cuil: string;

  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  city: string;

  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  location: string;

  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  province: string;

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[];

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
