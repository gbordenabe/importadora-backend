import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';

@Module({
  providers: [StorageService],
  imports: [TypeOrmModule.forFeature([File])],
  exports: [StorageService, TypeOrmModule],
})
export class StorageModule {}
