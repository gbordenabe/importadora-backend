import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, ILike, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';

import {
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';

import { handleExceptions } from 'src/common/errors/handleExceptions';
import { FindAllCompaniesQueryDto } from '../dto/find-all-companies-query.dto';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { COMPANY_ORDER_BY_ENUM } from '../dto/enum/company-order-by.enum';

@Injectable()
export class CompanyService
  implements IServiceInterface<Company, CreateCompanyDto, UpdateCompanyDto>
{
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(queryParams: FindAllCompaniesQueryDto) {
    const {
      page = 1,
      page_size = 20,
      nameFilter,
      order = ORDER_ENUM.ASC,
      order_by = COMPANY_ORDER_BY_ENUM.ID,
    } = queryParams;
    const [data, count] = await this.companyRepository.findAndCount({
      skip: (page - 1) * page_size,
      take: page_size,
      where: {
        is_active: true,
        name: nameFilter ? ILike(`%${nameFilter.toLowerCase()}%`) : undefined,
      },
      order: {
        [order_by]: order,
      },
    });
    return { data, count };
  }
  entityName: string = Company.name;
  findOneById({ id, relations = true }: IFindOneByIdOptions): Promise<Company> {
    const company = this.companyRepository.findOne({
      where: { id },
      relations: relations ? this.relations : [],
    });
    if (!company)
      throw new NotFoundException(`Company with id ${id} not found`);
    return company;
  }
  async create(dto: CreateCompanyDto): Promise<Company> {
    const dtoVerified = await this.getAndVerifyDto(dto);
    try {
      return await this.companyRepository.save(dtoVerified);
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async updateOneById(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOneById({ id });
    const dtoVerified = await this.getAndVerifyDto(dto);
    try {
      return await this.companyRepository.save({
        ...company,
        ...dtoVerified,
      });
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async removeOneById(id: number): Promise<void> {
    await this.findOneById({ id });
    await this.companyRepository.update(id, { is_active: false });
  }
  relations: FindOptionsRelations<Company> = {};
  async getAndVerifyDto(
    dto: Partial<CreateCompanyDto & UpdateCompanyDto> = {},
  ): Promise<Company> {
    return this.companyRepository.create(dto);
  }
}
