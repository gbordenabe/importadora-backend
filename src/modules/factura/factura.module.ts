import { Module } from '@nestjs/common';
import { FacturaService } from './service/factura.service';
import { FacturaController } from './controller/factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { TipoFacturaModule } from '../tipo-factura/tipo-factura.module';

@Module({
  imports:[TypeOrmModule.forFeature([Factura]), TipoFacturaModule],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports:[TypeOrmModule],
})
export class FacturaModule {}
