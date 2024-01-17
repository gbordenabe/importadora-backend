import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create/create-cliente.dto';
import { UpdateClienteDto } from './dto/update/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      const generador_de_codigo = await this.generarCorrelativoUser();
      await Promise.all(generador_de_codigo);
      const client = await this.clienteRepository.save({
        number_client: generador_de_codigo,
        ...createClienteDto,
      });

      await this.findOne(client.id);
      return await this.findOne(client.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Cliente[]> {
    try {
      const getClientAll = await this.clienteRepository.find({
        where: { isActive: true },
      });
      return getClientAll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Cliente> {
    try {
      const getClientOne = await this.clienteRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!getClientOne) {
        throw new NotFoundException('No se encuentra el cliente');
      }
      return getClientOne;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    try {
      await this.findOne(id);
      await this.clienteRepository.update(id, {
        ...updateClienteDto,
        dateUpdate: new Date(),
      });
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.clienteRepository.update(id, {
        isActive: false,
        dateDelete: new Date(),
      });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /*función */
  async generarCorrelativoUser(): Promise<string> {
    try {
      // Valor por defecto si no hay registros en la base de datos
      let nuevoValor = '000000001';

      // Encontrar el último registro basado en el campo 'id' en orden descendente
      const ultimoRegistro = await this.clienteRepository.findOne({
        order: {
          id: 'DESC',
        },
        where: {
          isActive: true,
        },
      });

      // Verificar si se encontró algún registro en la base de datos
      if (ultimoRegistro && ultimoRegistro.number_client) {
        let ultimoNumero = parseInt(ultimoRegistro.number_client, 10);
        ultimoNumero++;

        let existe = true;
        while (existe) {
          // Verificar si el valor ya existe en la base de datos
          const existeRegistro = await this.clienteRepository.findOne({
            where: {
              number_client: ultimoNumero.toString().padStart(9, '0'),
            },
          });

          if (existeRegistro) {
            ultimoNumero++;
          } else {
            nuevoValor = ultimoNumero.toString().padStart(9, '0');
            existe = false;
          }
        }
      }

      return nuevoValor;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
