import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { ClienteModule } from '../cliente/cliente.module';
import { EmpresaModule } from '../empresa/empresa.module';
import { FacturaModule } from '../factura/factura.module';
import { TipoFacturaModule } from '../tipo-factura/tipo-factura.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { SaldosModule } from '../saldos/saldos.module';
import { PagosModule } from '../pagos/pagos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaccion]),
    AuthModule,

    FacturaModule,
    SaldosModule,
    UsuariosModule,
    PagosModule,
  ],
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TypeOrmModule],
})
export class TransaccionModule {}
