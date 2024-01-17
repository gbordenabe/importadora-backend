import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubTipoPagoDto } from './dto/create-sub-tipo-pago.dto';
import { UpdateSubTipoPagoDto } from './dto/update-sub-tipo-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTipoPago } from './entities/sub-tipo-pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubTipoPagoService {
  constructor(
    @InjectRepository(SubTipoPago)
    private readonly subTipoPagoRepository: Repository<SubTipoPago>,
  ) {}

  async send(): Promise<SubTipoPago[]> {
    try {
      const data = await this.findAll();
      if (data.length>0) return data;
      const arrData = ['Propio', 'De terceros', 'Electrónico'];

      const dataArrau =  arrData.map(async (item: string) => {
        await this.create({ subTipo: item });
      });
      await Promise.all(dataArrau);
      return await this.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(
    createSubTipoPagoDto: CreateSubTipoPagoDto,
  ): Promise<SubTipoPago> {
    try {
      const data = await this.subTipoPagoRepository.save(createSubTipoPagoDto);

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<SubTipoPago[]> {
    try {
      const data = await this.subTipoPagoRepository.find({
        where: {
          isActive: true,
        },
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<SubTipoPago> {
    try {
      const data = await this.subTipoPagoRepository.findOne({
        where: {
          id,
          isActive: true,
        },
      });
      if (!data)
        throw new BadRequestException(`No se encuentra con el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(
    id: string,
    updateSubTipoPagoDto: UpdateSubTipoPagoDto,
  ): Promise<SubTipoPago> {
    try {
      await this.findOne(id);
      await this.subTipoPagoRepository.update(id, updateSubTipoPagoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.subTipoPagoRepository.update(id, { isActive: false });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
