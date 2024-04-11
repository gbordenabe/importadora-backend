import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseService } from './services/database.service';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';

@Module({
  providers: [DatabaseService],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [],
      useFactory: async () => {
        const options: TypeOrmModuleOptions = {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          database: process.env.DB_NAME,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        };
        console.info({ options });
        return options;
      },
    }),
    UserModule,
    RoleModule,
  ],
})
export class DatabaseModule {}
