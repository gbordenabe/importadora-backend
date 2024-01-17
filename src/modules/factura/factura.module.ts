import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './entities/factura.entity';
import { TipoFacturaModule } from '../tipo-factura/tipo-factura.module';

@Module({
  imports:[TypeOrmModule.forFeature([Factura]), TipoFacturaModule],
  controllers: [FacturaController],
  providers: [FacturaService],
  exports:[TypeOrmModule,FacturaService],
})
export class FacturaModule {}
