import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TRANSACTION_STATUS_ENUM } from 'src/modules/transaction/entities/enum/transaction-status-.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class History {
  @ApiProperty({ uniqueItems: true, type: 'integer' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ApiProperty({ type: () => Transaction })
  @ManyToOne(() => Transaction, (transaction) => transaction.histories)
  @JoinColumn({ name: 'transaction' })
  transaction: Transaction;

  @ApiProperty()
  @Column({ name: 'statuses' })
  @IsEnum({ TRANSACTION_STATUS_ENUM })
  statuses: TRANSACTION_STATUS_ENUM;

  @ApiProperty()
  @Column({ name: 'payment_type', nullable: true })
  payment_type: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty()
  @Column({ type: 'jsonb', nullable: true })
  data: any;
}
