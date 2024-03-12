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
import { numericOrNullTransformer } from 'src/common/utilities/numeric_transformer.utility';

export class Balance implements LogFields {
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

  @ApiProperty({ type: () => User, nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ApiProperty({ type: String })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  created_at: Date;

  @ApiProperty({ type: String, nullable: true })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updated_at: Date;

  @ApiProperty({ description: 'numeric(20, 2)' })
  @Column({
    type: 'numeric',
    precision: 20,
    scale: 2,
    transformer: numericOrNullTransformer,
  })
  amount: number;

  @ApiProperty({ type: Date })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true })
  observation: string;
}
