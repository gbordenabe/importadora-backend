import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Pago } from './entities/pago.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoPago } from '../tipo-pago/entities/tipo-pago.entity';
import { SubTipoPagoService } from '../sub-tipo-pago/sub-tipo-pago.service';
import { TipoPagoService } from '../tipo-pago/tipo-pago.service';
import { SubTipoPago } from '../sub-tipo-pago/entities/sub-tipo-pago.entity';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    private readonly tipoPagoRepository: TipoPagoService,
    private readonly subTipoPagoRepository: SubTipoPagoService,
  ) {}

  async create(createPagoDto: CreatePagoDto): Promise<Pago> {
    const { idTipoPago, idSubTipoPago, ...respuesta } = createPagoDto;
    try {
      const tipoPago: TipoPago =
        await this.tipoPagoRepository.findOne(idTipoPago);

      const subTipoPago: SubTipoPago =
        await this.subTipoPagoRepository.findOne(idSubTipoPago);

      const data: Pago = await this.pagoRepository.save({
        tipoPago,
        subTipoPago,
        ...respuesta,
      });

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Pago[]> {
    try {
      const data: Pago[] = await this.pagoRepository.find({
        where: { isActive: true },

        relations: ['tipoPago', 'subTipoPago'],
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<Pago> {
    try {
      const data: Pago = await this.pagoRepository.findOne({
        where: { id, isActive: true },

        relations: ['tipoPago', 'subTipoPago'],
      });
      if (!data) throw new BadRequestException(`No existe el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updatePagoDto: UpdatePagoDto): Promise<Pago> {
    const { idTipoPago, idSubTipoPago, ...rep } = updatePagoDto;
    try {
      await this.findOne(id);

      const tipoPago: TipoPago =
        await this.tipoPagoRepository.findOne(idTipoPago);

      const subTipoPago: SubTipoPago =
        await this.subTipoPagoRepository.findOne(idSubTipoPago);

      await this.pagoRepository.update(id, {
        tipoPago,
        subTipoPago,
        ...rep,
      });
      return this.findOne(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.pagoRepository.update(id, { isActive: false });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
