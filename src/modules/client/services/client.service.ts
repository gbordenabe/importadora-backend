import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsOrder,
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
import { CLIENT_ORDER_BY_ENUM } from '../dto/enum/client-order-by.enum';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';

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
      order = ORDER_ENUM.DESC,
      order_by = CLIENT_ORDER_BY_ENUM.CLIENT_NUMBER,
    } = queryParams;
    const defaultQuery: FindOptionsWhere<Client> = {
      is_active: true,
    };

    const [data, count] = await this.clientRepository.findAndCount({
      /* skip: (page - 1) * page_size,
      take: page_size, */
      where: [
        {
          ...defaultQuery,
          business_name: nameFilter
            ? ILike(`%${nameFilter.toLowerCase()}%`)
            : undefined,
        },
        {
          ...defaultQuery,
          client_number: nameFilter
            ? ILike(`%${nameFilter.toLowerCase()}%`)
            : undefined,
        },
      ],
      /* order: {
        [order_by]: order,
      }, */
    });

    data.sort((a, b) => {
      if (order === 'ASC') {
        return parseInt(a.client_number) - parseInt(b.client_number);
      } else {
        return parseInt(b.client_number) - parseInt(a.client_number);
      }
    });

    const start = (page - 1) * page_size;
    const end = page * page_size;
    const paginatedData = data.slice(start, end);

    return { data: paginatedData, count };
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

  async bulkCreation(clients: CreateClientDto[]) {
    try {
      await this.clientRepository.save(clients);
      return 'Clients created successfully.';
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async findAllBulk(): Promise<string[]> {
    const clients = await this.clientRepository.find();
    return clients.map((client) => client.client_number);
  }
}
