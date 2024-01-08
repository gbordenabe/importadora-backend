import { Module } from '@nestjs/common';
import { ClienteService } from './service/cliente.service';
import { ClienteController } from './controller/cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Cliente])],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports:[TypeOrmModule],
})
export class ClienteModule {}
