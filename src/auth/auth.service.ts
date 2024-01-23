import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, Tipo_Usuario, ...userData } = createUserDto;
      if (Tipo_Usuario === 'CLIENTE') {
        const user: User = await this.userRepository.save({
          ...userData,
          tipo_Usuario: Tipo_Usuario,
          roles: ['user'],
          password: bcrypt.hashSync(password, 10),
        });

        delete user.password;
        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      } else if (Tipo_Usuario === 'TESORERO') {
        if (!password)
          throw new BadRequestException(`No se ingreso la contraseña`);
        const user: User = await this.userRepository.save({
          ...userData,
          tipo_Usuario: Tipo_Usuario,
          roles: ['tesorero'],
          password: bcrypt.hashSync(password, 10),
        });

        delete user.password;
        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      } else if (Tipo_Usuario === 'VENDEDOR') {
        if (!password)
          throw new BadRequestException(`No se ingreso la contraseña`);
        const user: User = await this.userRepository.save({
          ...userData,
          tipo_Usuario: Tipo_Usuario,
          roles: ['vendedor'],
          password: bcrypt.hashSync(password, 10),
        });

        delete user.password;
        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      } else if (Tipo_Usuario === 'EMPRESA') {
        const user: User = await this.userRepository.save({
          ...userData,
          tipo_Usuario: Tipo_Usuario,
          roles: ['user'],
          password: bcrypt.hashSync(password, 10),
        });

        delete user.password;
        return {
          ...user,
          token: this.getJwtToken({ id: user.id }),
        };
      }

      throw new BadRequestException(
        `No se ingreso el tipo de usuario 'CLIENTE', 'TESORERO', 'EMPRESA', 'VENDEDOR'`,
      );
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, username } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
      select: {
        username: true,
        password: true,
        id: true,
        name: true,
        lastname: true,
        roles: true,
      }, //! OJO!
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // createFuncion(createUsuarioDto: CreateUsuarioDto) {
  //   return 'This action adds a new usuario';
  // }

  async findAllFuncion(): Promise<User[]> {
    try {
      const data = await this.userRepository.find({
        where: {
          isActive: true,
        },
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOneFuncion(id: string): Promise<User> {
    try {
      const data = await this.userRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!data) throw new BadRequestException(`No se encuentra el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // updateFuncion(id: number, updateUsuarioDto: UpdateUsuarioDto) {
  //   return `This action updates a #${id} usuario`;
  // }

  // removeFuncion(id: number) {
  //   return `This action removes a #${id} usuario`;
  // }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }
}
