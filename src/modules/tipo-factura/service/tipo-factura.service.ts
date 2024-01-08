import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipoFacturaDto } from '../dto/create/create-tipo-factura.dto';
import { UpdateTipoFacturaDto } from '../dto/update/update-tipo-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoFactura } from '../entities/tipo-factura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoFacturaService {

  constructor(
    @InjectRepository(TipoFactura)
    private readonly tipoFacturaRepository: Repository<TipoFactura>,
  ) {}

  async create(createTipoFacturaDto: CreateTipoFacturaDto) {
    try {
      return await this.tipoFacturaRepository.save(createTipoFacturaDto);
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    const getTipoFacturaAll = await this.tipoFacturaRepository.find()
    return getTipoFacturaAll;
  }

  async findOne(id: string) {
    const getTipoFacturaOne = await this.tipoFacturaRepository.findOne({
      where: {
        id
      },
    });
    if (!getTipoFacturaOne){
      throw new NotFoundException('No se encuentra el dato correspondiente');
    }
    return getTipoFacturaOne;
  }

  async update(id: string, updateTipoFacturaDto: UpdateTipoFacturaDto) {
    try {
      await this.tipoFacturaRepository.update(id, {
        ...updateTipoFacturaDto,
      })
      const getTipoFacturaId = await this.findOne(id);
      return getTipoFacturaId;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    return `This action removes a #${id} tipoFactura`;
  }
}
