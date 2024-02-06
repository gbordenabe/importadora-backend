import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UsuariosController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from '../role/role.module';
import { UserVerificationCode } from './entities/user-verification-code.entity';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserVerificationCode]),
    forwardRef(() => AuthModule),
    RoleModule,
    EmailModule,
  ],
  controllers: [UsuariosController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
