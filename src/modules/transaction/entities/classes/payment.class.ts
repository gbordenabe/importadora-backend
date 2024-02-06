import { ApiProperty } from '@nestjs/swagger';
import { LogFields } from 'src/common/entities/log-fields';
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { TRANSACTION_STATUS_ENUM } from '../enum/transaction-status-.enum';

export class Payment implements LogFields {
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

  @ApiProperty({ maxLength: 25 })
  @Column({ length: 25 })
  document_number: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ApiProperty({ type: () => User, nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ApiProperty({ type: String })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ type: String, nullable: true })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updated_at: Date;

  //amount 10, 2 not null
  @ApiProperty({ description: 'numeric(10, 2)' })
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ type: Date })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observation: string;
}
