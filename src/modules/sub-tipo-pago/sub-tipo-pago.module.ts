import { Module } from '@nestjs/common';
import { SubTipoPagoService } from './sub-tipo-pago.service';
import { SubTipoPagoController } from './sub-tipo-pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTipoPago } from './entities/sub-tipo-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubTipoPago])],
  controllers: [SubTipoPagoController],
  providers: [SubTipoPagoService],
  exports: [TypeOrmModule, SubTipoPagoService],
})
export class SubTipoPagoModule {}
