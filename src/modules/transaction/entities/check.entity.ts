import {
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { Payment } from './classes/payment.class';
import { IItemTransaction } from './interfaces/transaction-item.interface';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CHECK_TYPE_ENUM } from './enum/check-type.enum';
import { History } from 'src/modules/history/entities/history.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { toJson } from 'src/common/helpers/to-json.helper';

@Entity()
export class Check extends Payment implements IItemTransaction {
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
        document_number: this.document_number,
        bank_name: this.bank_name,
        type: this.type,
        amount: this.amount,
        date: this.date,
        observation: this.observation,
        approving_treasurer: this.approving_treasurer,
      }),
    } as History);
  }
  //bank name
  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  bank_name: string;

  @ApiProperty({ enum: CHECK_TYPE_ENUM })
  @Column({
    type: 'enum',
    enum: CHECK_TYPE_ENUM,
  })
  type: CHECK_TYPE_ENUM;

  @ApiProperty({ type: () => Transaction })
  @ManyToOne(() => Transaction, (transaction) => transaction.checks)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
