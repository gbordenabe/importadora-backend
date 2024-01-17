import { Module } from '@nestjs/common';
import { EstadoTransaccionService } from './estado-transaccion.service';
import { EstadoTransaccionController } from './estado-transaccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoTransaccion } from './entities/estado-transaccion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstadoTransaccion])],
  controllers: [EstadoTransaccionController],
  providers: [EstadoTransaccionService],
  exports: [TypeOrmModule, EstadoTransaccionService],
})
export class EstadoTransaccionModule {}
