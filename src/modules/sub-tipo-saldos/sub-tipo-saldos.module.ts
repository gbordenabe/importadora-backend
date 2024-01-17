import { Module } from '@nestjs/common';
import { SubTipoSaldosService } from './sub-tipo-saldos.service';
import { SubTipoSaldosController } from './sub-tipo-saldos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTipoSaldo } from './entities/sub-tipo-saldo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubTipoSaldo])],
  controllers: [SubTipoSaldosController],
  providers: [SubTipoSaldosService],
  exports: [TypeOrmModule, SubTipoSaldosService],
})
export class SubTipoSaldosModule {}
