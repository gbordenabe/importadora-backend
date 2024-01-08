import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFacturaDto } from '../dto/create/create-factura.dto';
import { UpdateFacturaDto } from '../dto/update/update-factura.dto';
import { Factura } from '../entities/factura.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaccion } from 'src/modules/transaccion/entities/transaccion.entity';
import { TipoFactura } from 'src/modules/tipo-factura/entities/tipo-factura.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(TipoFactura)
    private readonly tipoFacturaRepository: Repository<TipoFactura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const factura = this.facturaRepository.create(createFacturaDto);
    return await this.facturaRepository.save(factura);
  }

  async findAll() {
    const getFacturaAll = await this.facturaRepository.find({
      where: { isActive: true },
      relations: ['transacciones'],
    })
    return getFacturaAll;
  }

  async findOne(id: string) {
    const getFacturaOne = await this.facturaRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: ['transacciones'],
    });
    if (!getFacturaOne){
      throw new NotFoundException('No se encuentra la factura correspondiente');
    }
    return getFacturaOne;
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    try {
      await this.facturaRepository.update(id, {
        ...updateFacturaDto, dateUpdate:new Date(),
      })
      const getFacturaId = await this.facturaRepository.findOne({
        where: {
          id,
        },
        relations: ['transacciones'],
      });
      return getFacturaId;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.facturaRepository.update(id, {
        isActive: false, dateDelete:new Date(),
      });
      const getFacturaAll = await this.findAll();
      return getFacturaAll;
    } catch (error) {
      return error;
    }
  }
}
