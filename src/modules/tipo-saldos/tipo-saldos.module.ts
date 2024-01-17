import { Module } from '@nestjs/common';
import { TipoSaldosService } from './tipo-saldos.service';
import { TipoSaldosController } from './tipo-saldos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSaldo } from './entities/tipo-saldo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSaldo])],
  controllers: [TipoSaldosController],
  providers: [TipoSaldosService],
  exports: [TypeOrmModule, TipoSaldosService],
})
export class TipoSaldosModule {}
