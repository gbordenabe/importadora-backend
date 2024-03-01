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
import { IItemTransactionWithFile } from './interfaces/transaction-item.interface';
import { Transaction } from './transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { History } from 'src/modules/history/entities/history.entity';
import { toJson } from 'src/common/helpers/to-json.helper';
import { User } from 'src/modules/user/entities/user.entity';
import { File } from 'src/storage-service/entities/file.entity';

@Entity()
export class Cash extends Payment implements IItemTransactionWithFile {
  @ApiProperty({ nullable: true, type: () => File })
  @ManyToOne(() => File, { nullable: true, cascade: true })
  @JoinColumn({ name: 'file_id' })
  file: File;

  @ApiProperty({ nullable: true, maxLength: 500 })
  @Column({ type: 'text', nullable: true })
  request_change_comment: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { nullable: true })
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
        amount: this.amount,
        date: this.date,
        observation: this.observation,
        approving_treasurer: this.approving_treasurer,
      }),
    } as History);
  }
  @ApiProperty({ type: () => Transaction })
  @ManyToOne(() => Transaction, (transaction) => transaction.cash)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}
