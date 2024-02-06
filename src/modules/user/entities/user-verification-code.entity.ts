import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TypeCode } from './enum/type-code.enum';

@Entity('user_verification_code')
export class UserVerificationCode {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({ type: () => User, nullable: true })
  @ManyToOne(() => User, (user) => user.verification_codes, { nullable: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;

  @ApiProperty({ enum: TypeCode })
  @Column({ type: 'enum', enum: TypeCode })
  type_code: TypeCode;

  @ApiProperty({ nullable: true, maxLength: 100 })
  @Column({ name: 'email', type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ApiProperty({ nullable: false, maxLength: 250 })
  @Column({ name: 'code', type: 'varchar', length: 250, nullable: false })
  code: string;
}
