import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoFactura } from 'src/modules/tipo-factura/entities/tipo-factura.entity';
import { TipoFacturaService } from 'src/modules/tipo-factura/service/tipo-factura.service';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,

    private readonly tipoFacturaRepository: TipoFacturaService,
  ) {}

  async create(createFacturaDto: CreateFacturaDto): Promise<Factura> {
    try {
      const { tipoFacturaId, ...rest } = createFacturaDto;

      let tipoFact: any = null;

      if (tipoFacturaId) {
        tipoFact = await this.tipoFacturaRepository.findOne(tipoFacturaId);
      }

      const factura = await this.facturaRepository.save({
        ...rest,
        tipoFactura: tipoFact,
      });

      return await this.findOne(factura.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Factura[]> {
    try {
      const getFacturaAll = await this.facturaRepository.find({
        where: { isActive: true },
        relations: ['transacciones', 'tipoFact'],
      });
      return getFacturaAll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Factura> {
    try {
      const getFacturaOne = await this.facturaRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['transacciones'],
      });
      if (!getFacturaOne) {
        throw new NotFoundException(
          'No se encuentra la factura correspondiente',
        );
      }
      return getFacturaOne;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateFacturaDto: UpdateFacturaDto,
  ): Promise<Factura> {
    try {
      await this.findOne(id);
      await this.facturaRepository.update(id, {
        ...updateFacturaDto,
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
      await this.facturaRepository.update(id, {
        isActive: false,
        dateDelete: new Date(),
      });
      await this.findAll();
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
