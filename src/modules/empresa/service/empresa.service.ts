import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from '../dto/create/create-empresa.dto';
import { UpdateEmpresaDto } from '../dto/update/update-empresa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../entities/empresa.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpresaService {

  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    try {
      return await this.empresaRepository.save(createEmpresaDto);
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const getEmpresaAll = await this.empresaRepository.find({
      where: { isActive: true },
    });
    return getEmpresaAll;
  }

  async findOne(id: string) {
    const getEmpresaOne = await this.empresaRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    if (!getEmpresaOne){
      throw new NotFoundException('No se encuentra el dato correspondiente');
    }
    return getEmpresaOne;
  }

  async findId(id: string) {
    const getEmpresaOne = await this.empresaRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    if (!getEmpresaOne){
      throw new NotFoundException('No se encuentra el dato correspondiente');
    }
    return getEmpresaOne.id;
  }

  async update(id: string , updateEmpresaDto: UpdateEmpresaDto) {
    try {
      await this.empresaRepository.update(id, {
        ...updateEmpresaDto, dateUpdate:new Date(),
      })
      const getEmpresaId = await this.findOne(id);
      return getEmpresaId;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.empresaRepository.update(id, {
        isActive: false, dateDelete:new Date(),
      });
      const getEmpresaAll = await this.findAll();
      return getEmpresaAll;
    } catch (error) {
      return error;
    }
  }
}