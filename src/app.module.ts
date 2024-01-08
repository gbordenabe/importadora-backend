import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmpresaModule } from './modules/empresa/empresa.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { TransaccionModule } from './modules/transaccion/transaccion.module';
import { FacturaModule } from './modules/factura/factura.module';
import { TipoFacturaModule } from './modules/tipo-factura/tipo-factura.module';

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
    TipoFacturaModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}