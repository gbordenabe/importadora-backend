import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controller/company.controller';
import { Company } from './entities/company.entity';
import { CompanyService } from './services/company.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [TypeOrmModule, CompanyService],
})
export class CompanyModule {}
