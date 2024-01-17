import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { EmpresaService } from '../empresa/empresa.service';
import { User } from 'src/auth/entities/user.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { ClienteService } from '../cliente/cliente.service';
import { Cliente } from '../cliente/entities/cliente.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    private readonly authRepository: AuthService,

    private readonly clienteRepository: ClienteService,
    private readonly empresaRepository: EmpresaService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const { idCliente, idEmpresa } = createUsuarioDto;
      const empresa: Empresa = await this.empresaRepository.findOne(idEmpresa);
      const user: Cliente = await this.clienteRepository.findOne(idCliente);

      const data = await this.usuarioRepository.save({
        empresa,
        user,
      });
      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      const data = await this.usuarioRepository.find({
        where: {
          isActive: true,
        },
        relations: ['user', 'empresa'],
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Usuario> {
    try {
      const data = await this.usuarioRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['user', 'empresa'],
      });
      if (!data) throw new BadRequestException(`No se encuentra el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    try {
      const { idCliente, idEmpresa } = updateUsuarioDto;
      const empresa: Empresa = await this.empresaRepository.findOne(idEmpresa);
      const user: User = await this.authRepository.findOneFuncion(idCliente);
      await this.findOne(id);
      await this.usuarioRepository.update(id, {
        empresa,
        user,
      });

      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.usuarioRepository.update(id, {
        isActive: false,
      });

      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
