import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { Encrypter } from 'src/common/utilities/encrypter';
import { RefreshTokenDto } from './dto/refres-token.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserVerificationCode } from 'src/modules/user/entities/user-verification-code.entity';
import { TypeCode } from 'src/modules/user/entities/enum/type-code.enum';
import { EmailService } from 'src/email/services/email.service';
import { RecoverPasswordByEmailDto } from './dto/recover-password-by-email.dto';
import { getRandomInteger } from 'src/common/utilities/random-integer-id.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserVerificationCode)
    private readonly userVerificationCodeRepository: Repository<UserVerificationCode>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login({
    user_name_or_email,
    password,
  }: LoginUserDto): Promise<LoginResponseDto> {
    let user = await this.userRepository.findOne({
      where: [
        { user_name: user_name_or_email },
        { email: user_name_or_email, is_email_verified: true },
      ],
      select: {
        id: true,
        password: true,
        is_active: true,
      },
    });
    if (!user) throw new UnauthorizedException('Credentials are invalid');
    if (!Encrypter.checkPassword(password, user.password))
      throw new UnauthorizedException('Credentials are invalid');
    if (!user.is_active)
      throw new UnauthorizedException('User is inactive, talk with an admin');
    user = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        role: true,
      },
    });
    return {
      user,
      jwt: this.getJwt({ id: user.id }),
    };
  }
  async checkCodeAndEmail(code: string, email: string) {
    const verificacionCode = await this.userVerificationCodeRepository.findOne({
      where: {
        type_code: TypeCode.PASSWORD_RESTORE,
        code,
        email,
      },
    });
    if (!verificacionCode)
      throw new NotFoundException(
        `No se encontro el codigo de verificación de correo: ${email} - ${code}`,
      );
  }

  //solicitud de recuperacion de contraseña
  async requestPasswordRecovery(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
      is_email_verified: true,
    });
    if (!user)
      throw new NotFoundException(
        `No se encontro el usuario con el correo proporcionado o no ha verificado su correo: ${email}`,
      );
    //borrar codigos anteriores
    const userVerificationCode =
      await this.userVerificationCodeRepository.findOneBy({
        user: { id: user.id },
        type_code: TypeCode.PASSWORD_RESTORE,
      });
    if (userVerificationCode)
      await this.userVerificationCodeRepository.remove(userVerificationCode);
    //
    //crear codigo y enviarlo al correo
    const code = this.getCode();
    await this.userVerificationCodeRepository.save({
      code,
      type_code: TypeCode.PASSWORD_RESTORE,
      email,
      user,
    });
    await this.emailService.sendEmailHtml(
      user.email,
      'Recuperación de contraseña',
      `Su codigo de recuperación es: ${code}`,
    );
  }
  //recuperar contraseña una vez que se ha solicitado
  async recoverPasswordByEmail({
    code,
    email,
    new_password,
  }: RecoverPasswordByEmailDto) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(
        `El usuario con el correo ${email} no existe`,
      );
    const verificationCode =
      await this.userVerificationCodeRepository.findOneBy({
        user: {
          id: user.id,
        },
        code,
        type_code: TypeCode.PASSWORD_RESTORE,
      });
    if (!verificationCode)
      throw new UnauthorizedException(
        'El usuario no ha solicitado recuperar su contraseña',
      );
    user.password = Encrypter.encrypt(new_password);
    await Promise.all([
      this.userRepository.save(user),
      this.userVerificationCodeRepository.delete({
        id: verificationCode.id,
      }),
    ]);
  }
  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
  async refreshToken(jwt: string): Promise<RefreshTokenDto> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(jwt);
      return { jwt: this.getJwt({ id: payload.id }) };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  private getCode() {
    return getRandomInteger(6).toString();
  }
}
