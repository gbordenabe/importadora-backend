import { ApiProperty } from '@nestjs/swagger';
import { LogFields } from 'src/common/entities/log-fields';
import { User } from 'src/modules/user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { TRANSACTION_STATUS_ENUM } from './enum/transaction-status-.enum';
import { IItemTransaction } from './interfaces/transaction-item.interface';
import { numericOrNullTransformer } from 'src/common/utilities/numeric_transformer.utility';
import { History } from 'src/modules/history/entities/history.entity';
import { toJson } from 'src/common/helpers/to-json.helper';

@Entity()
export class Bill extends LogFields implements IItemTransaction {
  @ApiProperty({ nullable: true, maxLength: 500 })
  @Column({ type: 'text', nullable: true })
  request_change_comment: string;

  @ApiProperty({ uniqueItems: true, type: 'integer' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  status: TRANSACTION_STATUS_ENUM;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ApiProperty({ type: () => Object })
  @ManyToOne(() => Transaction, (transaction) => transaction.bills)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ApiProperty({ maxLength: 20 })
  @Column({ length: 20 })
  number: string;

  @ApiProperty({ description: 'numeric(20, 2)' })
  @Column({
    type: 'numeric',
    precision: 20,
    scale: 2,
    transformer: numericOrNullTransformer,
  })
  amount: number;

  @ApiProperty({ type: String })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observation: string;

  @ApiProperty({ type: () => User, nullable: true })
  @ManyToOne(() => User, {
    nullable: true,
  })
  @JoinColumn({ name: 'approving_treasurer_id' })
  approving_treasurer: User;

  @ApiProperty({ type: () => [History] })
  @ManyToMany(() => History, { cascade: true })
  @JoinTable()
  historical: History[];

  @BeforeUpdate()
  setDataBeforeUpdateOnHistorical(): void {
    this.historical = this.historical || [];
    this.historical.push({
      created_by: this.created_by,
      data: toJson({
        status: this.status,
        number: this.number,
        amount: this.amount,
        date: this.date,
        observation: this.observation,
        approving_treasurer: this.approving_treasurer,
      }),
    } as History);
  }
}
