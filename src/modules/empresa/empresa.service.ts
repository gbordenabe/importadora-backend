import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    try {
      const data = await this.empresaRepository.save(createEmpresaDto);
      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Empresa[]> {
    try {
      const getEmpresaAll = await this.empresaRepository.find({
        where: { isActive: true },
      });
      return getEmpresaAll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Empresa> {
    try {
      const getEmpresaOne = await this.empresaRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!getEmpresaOne) {
        throw new BadRequestException(
          'No se encuentra el dato correspondiente',
        );
      }
      return getEmpresaOne;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findId(id: string): Promise<Empresa> {
    try {
      const getEmpresaOne = await this.empresaRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!getEmpresaOne) {
        throw new BadRequestException(
          'No se encuentra el dato correspondiente',
        );
      }
      return getEmpresaOne;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    try {
      await this.empresaRepository.update(id, {
        ...updateEmpresaDto,
        dateUpdate: new Date(),
      });
      const getEmpresaId = await this.findOne(id);
      return getEmpresaId;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.empresaRepository.update(id, {
        isActive: false,
        dateDelete: new Date(),
      });
      const getEmpresaAll = await this.findAll();
      return getEmpresaAll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
