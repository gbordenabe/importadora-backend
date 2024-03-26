import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { Client } from '../entities/client.entity';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';

import {
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';

import { handleExceptions } from 'src/common/errors/handleExceptions';
import { FindAllClientsQueryDto } from '../dto/find-all-clients-query.dto';

@Injectable()
export class ClientService
  implements IServiceInterface<Client, CreateClientDto, UpdateClientDto>
{
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(queryParams: FindAllClientsQueryDto) {
    const {
      page = 1,
      page_size = 20,
      nameFilter,
      order,
      order_by,
    } = queryParams;
    const defaultQuery: FindOptionsWhere<Client> = {
      is_active: true,
    };
    const [data, count] = await this.clientRepository.findAndCount({
      skip: (page - 1) * page_size,
      take: page_size,
      where: [
        {
          ...defaultQuery,
          name: nameFilter ? ILike(`%${nameFilter.toLowerCase()}%`) : undefined,
        },
        {
          ...defaultQuery,
          business_name: nameFilter
            ? ILike(`%${nameFilter.toLowerCase()}%`)
            : undefined,
        },
      ],
      order: {
        [order_by]: order,
      },
    });
    return { data, count };
  }
  entityName: string = Client.name;
  findOneById({ id, relations = true }: IFindOneByIdOptions): Promise<Client> {
    const client = this.clientRepository.findOne({
      where: { id },
      relations: relations ? this.relations : [],
    });
    if (!client) throw new NotFoundException(`Client with id ${id} not found`);
    return client;
  }
  async create(dto: CreateClientDto): Promise<Client> {
    const dtoVerified = await this.getAndVerifyDto(dto);
    try {
      return await this.clientRepository.save(dtoVerified);
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async updateOneById(id: number, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOneById({ id });
    const dtoVerified = await this.getAndVerifyDto(dto);
    try {
      return await this.clientRepository.save({
        ...client,
        ...dtoVerified,
      });
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async findOneClient(client: string): Promise<Client[]> {
    const regex = /^(?:[0-9]+|[a-zA-Z]+)$/;

    if (regex.test(client)) {
      return await this.clientRepository.find({
        where: [
          { client_number: ILike(`%${client}%`) },
          { name: ILike(`%${client}%`) },
        ],
      });
    } else {
      return await this.clientRepository.find({
        where: { business_name: ILike(`%${client}%`) },
      });
    }
  }

  async removeOneById(id: number): Promise<void> {
    await this.findOneById({ id });
    await this.clientRepository.update(id, { is_active: false });
  }
  relations: FindOptionsRelations<Client> = {};
  async getAndVerifyDto(
    dto: Partial<CreateClientDto & UpdateClientDto> = {},
  ): Promise<Client> {
    return this.clientRepository.create(dto);
  }
}
