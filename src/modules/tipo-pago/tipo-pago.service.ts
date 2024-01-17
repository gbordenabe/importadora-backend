import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipoPagoDto } from './dto/create-tipo-pago.dto';
import { UpdateTipoPagoDto } from './dto/update-tipo-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoPago } from './entities/tipo-pago.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoPagoService {
  constructor(
    @InjectRepository(TipoPago)
    private readonly tipoPagoRepository: Repository<TipoPago>,
  ) {}

  async send(): Promise<TipoPago[]> {
    try {
      const data = await this.findAll();
      if (data.length > 0) return data;
      const arrData = ['Cheque', 'Efectivo / Transferencia', 'Deposito'];

      const dataArrau = arrData.map(async (item: string) => {
        await this.create({ tipo: item });
      });
      await Promise.all(dataArrau);
      return await this.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async create(createTipoPagoDto: CreateTipoPagoDto): Promise<TipoPago> {
    try {
      const data = await this.tipoPagoRepository.save(createTipoPagoDto);

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<TipoPago[]> {
    try {
      const data = await this.tipoPagoRepository.find({
        where: {
          isActive: true,
        },
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<TipoPago> {
    try {
      const data = await this.tipoPagoRepository.findOne({
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
    updateTipoPagoDto: UpdateTipoPagoDto,
  ): Promise<TipoPago> {
    try {
      await this.findOne(id);
      await this.tipoPagoRepository.update(id, updateTipoPagoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.tipoPagoRepository.update(id, { isActive: false });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
