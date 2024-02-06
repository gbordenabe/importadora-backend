import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE_NAME_ENUM } from './role_name.enum';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class Role {
  @ApiProperty({ type: 'integer', uniqueItems: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ enum: ROLE_NAME_ENUM })
  @Column({ type: 'enum', enum: ROLE_NAME_ENUM, unique: true })
  name: ROLE_NAME_ENUM;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
