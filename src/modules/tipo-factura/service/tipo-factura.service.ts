import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(
    createTipoFacturaDto: CreateTipoFacturaDto,
  ): Promise<TipoFactura> {
    try {
      return await this.tipoFacturaRepository.save(createTipoFacturaDto);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findAll(): Promise<TipoFactura[]> {
    try {
      const getTipoFacturaAll = await this.tipoFacturaRepository.find();
      return getTipoFacturaAll;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string): Promise<TipoFactura> {
    try {
      const getTipoFacturaOne = await this.tipoFacturaRepository.findOne({
        where: {
          id,
        },
      });
      if (!getTipoFacturaOne) {
        throw new NotFoundException('No se encuentra el dato correspondiente');
      }
      return getTipoFacturaOne;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(
    id: string,
    updateTipoFacturaDto: UpdateTipoFacturaDto,
  ): Promise<TipoFactura> {
    try {
      await this.findOne(id);
      await this.tipoFacturaRepository.update(id, {
        ...updateTipoFacturaDto,
      });
      return await this.findOne(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.tipoFacturaRepository.update(id, {
        isActive: false,
      });
      return `Se borro el id:${id}`;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
