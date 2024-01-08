import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text', { unique: true })
  username: string;

  @Column('text')
  password: string;

  @Column('text')
  city?: string;

  @Column('text')
  location?: string;

  @Column('text')
  province?: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.username = this.username.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  dateUpdate: Date | null;

  @Column({ type: 'timestamp', default: null })
  dateDelete: Date | null;
}
