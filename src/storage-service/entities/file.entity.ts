import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class File {
  @ApiProperty({
    type: 'integer',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ maxLength: 350, uniqueItems: true })
  @Column('character varying', { length: 350, unique: true })
  file_name: string;

  @ApiProperty({ maxLength: 100 })
  @Column('character varying', { length: 100, nullable: true })
  size: string;

  @ApiProperty({ maxLength: 20 })
  @Column('character varying', { length: 200, nullable: true })
  type: string;

  buffer: Buffer;
}
