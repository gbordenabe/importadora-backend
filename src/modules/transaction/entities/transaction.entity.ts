import { ApiProperty } from '@nestjs/swagger';
import { LogFields } from 'src/common/entities/log-fields';
import { Client } from 'src/modules/client/entities/client.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Bill } from './bill.entity';
import { TRANSACTION_STATUS_ENUM } from './enum/transaction-status-.enum';
import { Check } from './check.entity';
import { Deposit } from './deposit.entity';
import { Cash } from './cash.entity';
import { Credit } from './credit.entity';
import { CreditNote } from './credit-note.entity';
import { Retention } from './retention.entity';
import { History } from 'src/modules/history/entities/history.entity';

@Entity()
export class Transaction extends LogFields {
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

  //bill status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  bill_status: TRANSACTION_STATUS_ENUM;

  //cash status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  cash_status: TRANSACTION_STATUS_ENUM;

  //check status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  check_status: TRANSACTION_STATUS_ENUM;

  //credit_note status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  credit_note_status: TRANSACTION_STATUS_ENUM;

  //credit status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  credit_status: TRANSACTION_STATUS_ENUM;

  //deposit status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  deposit_status: TRANSACTION_STATUS_ENUM;

  //retention status
  @ApiProperty({ enum: TRANSACTION_STATUS_ENUM })
  @Column({
    type: 'enum',
    enum: TRANSACTION_STATUS_ENUM,
    default: TRANSACTION_STATUS_ENUM.PENDING,
  })
  retention_status: TRANSACTION_STATUS_ENUM;

  @ApiProperty({ type: 'numeric(20, 2)' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_checks: number;

  @ApiProperty({ type: 'numeric(20, 2)' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_deposit: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_cash: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_credit: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_credit_note: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_retention: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_bill: number;

  @ApiProperty({ type: 'numeric' })
  @Column({ type: 'numeric', precision: 20, scale: 2, nullable: true })
  total_amount: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  //sku 50 unique
  @ApiProperty({ uniqueItems: true, maxLength: 50 })
  @Column({ length: 50, unique: true })
  sku: string;

  @ApiProperty({ type: () => Company })
  @ManyToOne(() => Company, (company) => company.transactions)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ type: () => Client })
  @ManyToOne(() => Client, (client) => client.transactions)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ApiProperty({ type: () => [Bill] })
  @OneToMany(() => Bill, (bill) => bill.transaction, { cascade: true })
  bills: Bill[];

  @ApiProperty({ type: () => [Check] })
  @OneToMany(() => Check, (check) => check.transaction, { cascade: true })
  checks: Check[];

  @ApiProperty({ type: () => [Deposit] })
  @OneToMany(() => Deposit, (deposit) => deposit.transaction, { cascade: true })
  deposits: Deposit[];

  @ApiProperty({ type: () => [Cash] })
  @OneToMany(() => Cash, (cash) => cash.transaction, { cascade: true })
  cash: Cash[];

  @ApiProperty({ type: () => [Credit] })
  @OneToMany(() => Credit, (Credit) => Credit.transaction, { cascade: true })
  credits: Credit[];

  @ApiProperty({ type: () => [CreditNote] })
  @OneToMany(() => CreditNote, (creditNote) => creditNote.transaction, {
    cascade: true,
  })
  credit_notes: CreditNote[];

  @ApiProperty({ type: () => [Retention] })
  @OneToMany(() => Retention, (retention) => retention.transaction, {
    cascade: true,
  })
  retentions: Retention[];

  @OneToMany(() => History, (history) => history.transaction)
  histories: History[];
}
