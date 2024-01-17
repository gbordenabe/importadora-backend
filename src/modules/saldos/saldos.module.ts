import { Module } from '@nestjs/common';
import { SaldosService } from './saldos.service';
import { SaldosController } from './saldos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saldo } from './entities/saldo.entity';
import { SubTipoSaldosModule } from '../sub-tipo-saldos/sub-tipo-saldos.module';
import { TipoSaldosModule } from '../tipo-saldos/tipo-saldos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Saldo]),SubTipoSaldosModule,TipoSaldosModule],
  controllers: [SaldosController],
  providers: [SaldosService],
  exports: [TypeOrmModule, SaldosService],
})
export class SaldosModule {}
