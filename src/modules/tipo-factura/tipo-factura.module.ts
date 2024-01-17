import { Module } from '@nestjs/common';
import { TipoFacturaService } from './service/tipo-factura.service';
import { TipoFacturaController } from './controller/tipo-factura.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoFactura } from './entities/tipo-factura.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TipoFactura])],
  controllers: [TipoFacturaController],
  providers: [TipoFacturaService],
  exports: [TypeOrmModule,TipoFacturaService],
})
export class TipoFacturaModule {}
