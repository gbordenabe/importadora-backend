import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-usuario.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsRelations, ILike, Repository } from 'typeorm';
import {
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { convertOptionalBooleanString } from 'src/common/utilities/convertOptionalBooleanString.util';
import { RoleService } from '../role/role.service';
import { Encrypter } from 'src/common/utilities/encrypter';
import { UserVerificationCode } from './entities/user-verification-code.entity';
import { TypeCode } from './entities/enum/type-code.enum';
import { getRandomInteger } from 'src/common/utilities/random-integer-id.helper';
import { EmailService } from 'src/email/services/email.service';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { USER_ORDER_BY_ENUM } from './dto/enum/user-order-by.enum';
export const userRelations: FindOptionsRelations<User> = {
  role: true,
};
@Injectable()
export class UserService
  implements IServiceInterface<User, CreateUserDto, UpdateUserDto>
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    @InjectRepository(UserVerificationCode)
    private readonly userVerificationCodeRepository: Repository<UserVerificationCode>,
    private readonly emailService: EmailService,
  ) {}
  entityName: string = User.name;
  private handlePasswordAndEmailChanges(user: User) {
    const { password, email } = user;
    if (password) {
      user.password = Encrypter.encrypt(password);
    }
    if (email || email === null) user.is_email_verified = false;
  }
  async updateOneById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById({ id });
    const dtoVerified = await this.getAndVerifyDto(dto);
    this.handlePasswordAndEmailChanges(dtoVerified);
    try {
      return await this.userRepository.save({
        ...user,
        ...dtoVerified,
      });
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async create(dto: CreateUserDto): Promise<User> {
    const dtoVerified = await this.getAndVerifyDto(dto);
    dtoVerified.password = Encrypter.encrypt(dtoVerified.password);
    try {
      const user = await this.userRepository.save(dtoVerified);
      return user;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async findAll(queryParams: FindAllUsersQueryDto) {
    const {
      page = 1,
      page_size = 20,
      relations,
      nameFilter,
      order = ORDER_ENUM.ASC,
      order_by = USER_ORDER_BY_ENUM.ID,
      roleId,
    } = queryParams;
    //! pendiente poner valores por defecto en el page y page_size por variables de entorno
    const [data, count] = await this.userRepository.findAndCount({
      where: {
        is_active: true,
        role: roleId ? { id: roleId } : undefined,
        name: nameFilter ? ILike(`%${nameFilter.toLowerCase()}%`) : undefined,
      },
      order: {
        [order_by]: order,
      },
      take: page_size,
      skip: (page - 1) * page_size,
      relations: convertOptionalBooleanString(relations) ? this.relations : [],
    });
    return { data, count };
  }
  async sendPersonalEmailVerificationCode(email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new InternalServerErrorException('User not found');
    await this.userVerificationCodeRepository.delete({
      type_code: TypeCode.EMAIL_VERIFICATION,
      email,
    });
    const code = getRandomInteger(6).toString();
    await this.userVerificationCodeRepository.save({
      type_code: TypeCode.EMAIL_VERIFICATION,
      email,
      code,
      user,
    });
    this.emailService.sendEmailMsg(
      email,
      'Verificación de correo',
      `Ingrese a el siguiente link ${process.env.HOST_API}/cuenta-verificada?code=${code}`,
    );
  }
  async verifyEmail(emailVerificationCode: string) {
    const verificationCode = await this.userVerificationCodeRepository.findOne({
      where: {
        type_code: TypeCode.EMAIL_VERIFICATION,
        code: emailVerificationCode,
      },
      relations: {
        user: true,
      },
    });
    if (!verificationCode) throw new NotFoundException('Código no encontrado');
    const user = verificationCode.user;
    await this.userRepository.save({
      id: user.id,
      is_email_verified: true,
    });
  }
  async findOneById({
    id,
    relations = true,
  }: IFindOneByIdOptions): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: relations ? this.relations : [],
    });
    if (!user) {
      throw new NotFoundException('User with id ' + id + ' not found');
    }
    return user;
  }
  async removeOneById(id: number): Promise<void> {
    await this.findOneById({ id });
    await this.userRepository.update(id, { is_active: false });
  }
  async getAndVerifyDto(
    dto: Partial<CreateUserDto & UpdateUserDto>,
  ): Promise<User> {
    const { role_id, ...rest } = dto;
    const [role] = await Promise.all([
      role_id ? this.roleService.findOneById(role_id) : undefined,
    ]);
    return this.userRepository.create({
      ...rest,
      role,
    });
  }
  relations: FindOptionsRelations<User> = userRelations;
}
