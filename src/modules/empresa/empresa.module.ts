import { Module } from '@nestjs/common';
import { EmpresaService } from './service/empresa.service';
import { EmpresaController } from './controller/empresa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports:[TypeOrmModule],
})
export class EmpresaModule {}
