import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { TransaccionModule } from './modules/transaccion/transaccion.module';
import { FacturaModule } from './modules/factura/factura.module';
import { TipoFacturaModule } from './modules/tipo-factura/tipo-factura.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { TipoPagoModule } from './modules/tipo-pago/tipo-pago.module';
import { EstadoTransaccionModule } from './modules/estado-transaccion/estado-transaccion.module';
import { SubTipoPagoModule } from './modules/sub-tipo-pago/sub-tipo-pago.module';
import { SaldosModule } from './modules/saldos/saldos.module';
import { TipoSaldosModule } from './modules/tipo-saldos/tipo-saldos.module';
import { SubTipoSaldosModule } from './modules/sub-tipo-saldos/sub-tipo-saldos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //Para evitar borrar los datos activar el false
    }),
    EmpresaModule,
    AuthModule,
    ClienteModule,
    TransaccionModule,
    FacturaModule,
    TipoFacturaModule,
    PagosModule,
    TipoPagoModule,
    EstadoTransaccionModule,
    SubTipoPagoModule,
    SaldosModule,
    TipoSaldosModule,
    SubTipoSaldosModule,
    UsuariosModule,
    EmailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}