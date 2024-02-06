import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { IItemTransaction } from './interfaces/transaction-item.interface';
import { Balance } from './classes/balance.class';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { numericOrNullTransformer } from 'src/common/utilities/numeric_transformer.utility';
import { History } from 'src/modules/history/entities/history.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { toJson } from 'src/common/helpers/to-json.helper';

@Entity()
export class CreditNote extends Balance implements IItemTransaction {
  @ApiProperty({ nullable: true, maxLength: 500 })
  @Column({ type: 'text', nullable: true })
  request_change_comment: string;

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
        amount: this.amount,
        porcentage: this.porcentage,
        date: this.date,
        observation: this.observation,
        approving_treasurer: this.approving_treasurer,
      }),
    } as History);
  }
  @ApiProperty({ type: () => Transaction })
  @ManyToOne(() => Transaction, (transaction) => transaction.credit_notes)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @ApiProperty({ description: 'numeric(5, 2)', nullable: true })
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericOrNullTransformer,
  })
  porcentage: number;
}
