import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from '../dto/create/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    try {
      const client = this.clienteRepository.create({
        ...createClienteDto})

      await this.clienteRepository.save(client);
      return client;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const getClientAll = await this.clienteRepository.find({
      where: { isActive: true },
    })
    return getClientAll;
  }

  async findOne(id: string) {
    const getClientOne = await this.clienteRepository.find({
      where: {
        id,
        isActive: true,
      },
    });
    if (!getClientOne){
      throw new NotFoundException('No se encuentra el cliente')
    }
    return getClientOne;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    try {
      await this.clienteRepository.update(id, {
        ...updateClienteDto, dateUpdate:new Date(),
      })
      const getClientId = await this.findOne(id);
      return getClientId;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.clienteRepository.update(id, {
        isActive: false, dateDelete:new Date(),
      });
      const getClientAll = await this.findAll();
      return getClientAll
    } catch (error) {
      return error;
    }
  }
  /*función */
  async generarCorrelativoUser(): Promise<string> {
    let nuevoValor = '000000001';

    // Encontrar el último registro basado en el ID en orden descendente
    const tuEntidadRepository = await this.clienteRepository.findOne({
      order: {
        id: 'DESC',
      },
      where: {}, // Aquí podrías agregar condiciones de búsqueda si es necesario
    });
  
    if (tuEntidadRepository && tuEntidadRepository.number_client) {
      let ultimoNumero = parseInt(tuEntidadRepository.number_client, 10);
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
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    //this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}

