import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @ApiProperty({ type: 'integer' })
  @PrimaryGeneratedColumn()
  id: number;

  //company 100 unique
  @ApiProperty({ maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  //acronym 3 unique
  @ApiProperty({ maxLength: 100 })
  @Column({ length: 3 })
  acronym: string;

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Transaction, (transaction) => transaction.company)
  transactions: Transaction[];
}
