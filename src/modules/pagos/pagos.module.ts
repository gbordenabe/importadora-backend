import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { TipoPagoModule } from '../tipo-pago/tipo-pago.module';
import { SubTipoPagoModule } from '../sub-tipo-pago/sub-tipo-pago.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    TipoPagoModule,
    SubTipoPagoModule,
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [TypeOrmModule, PagosService],
})
export class PagosModule {}
