import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserVerificationCode } from './user-verification-code.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

@Entity()
export class User {
  @ApiProperty({ uniqueItems: true, type: 'integer' })
  @PrimaryGeneratedColumn()
  id: number;

  //user_name 100 unique
  @ApiProperty({ uniqueItems: true, maxLength: 100 })
  @Column({ length: 100, unique: true })
  user_name: string;

  //email 100 unique nullable
  @ApiProperty({ uniqueItems: true, maxLength: 100, nullable: true })
  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  //password 255 not null
  @ApiProperty({ maxLength: 255 })
  @Column({ length: 255, select: false })
  password: string;

  //name 100 not null
  @ApiProperty({ maxLength: 100 })
  @Column({ length: 100 })
  name: string;

  //last_name 100 not null
  @ApiProperty({ maxLength: 100 })
  @Column({ length: 100 })
  last_name: string;

  //city 100 nullable
  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  city: string;

  //location 100 nullable
  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  location: string;

  //province 100 nullable
  @ApiProperty({ maxLength: 100, nullable: true })
  @Column({ length: 100, nullable: true })
  province: string;

  @ApiProperty({ type: () => Role })
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  //is_email_verified boolean default false
  @ApiProperty({ default: false })
  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @ApiProperty({ default: true })
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(
    () => UserVerificationCode,
    (user_verification_code) => user_verification_code.user,
  )
  verification_codes: UserVerificationCode[];

  @OneToMany(() => Transaction, (transaction) => transaction.created_by)
  transactions: Transaction[];
}
