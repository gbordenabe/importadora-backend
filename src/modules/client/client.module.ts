import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from './controller/client.controller';
import { ClientService } from './services/client.service';
import { AuthModule } from 'src/auth/auth.module';
import { Client } from './entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AuthModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [TypeOrmModule, ClientService],
})
export class ClientModule {}
