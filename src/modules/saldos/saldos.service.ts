import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';
import { Saldo } from './entities/saldo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTipoSaldosService } from '../sub-tipo-saldos/sub-tipo-saldos.service';
import { TipoSaldosService } from '../tipo-saldos/tipo-saldos.service';

@Injectable()
export class SaldosService {
  constructor(
    @InjectRepository(Saldo)
    private readonly saldoRepository: Repository<Saldo>,
    private readonly subTipoSaldoRepository: SubTipoSaldosService,
    private readonly tipoSaldoRepository: TipoSaldosService,
  ) {}
  async create(createSaldoDto: CreateSaldoDto) {
    try {
      const { idTipoPago, idSubTipoPago, ...rep } = createSaldoDto;
      const tipoPago = await this.tipoSaldoRepository.findOne(idTipoPago);
      const subTipoPago =
        await this.subTipoSaldoRepository.findOne(idSubTipoPago);

      const data: Saldo = await this.saldoRepository.save({
        tipoPago,
        subTipoPago,
        ...rep,
      });

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const data = await this.saldoRepository.find({
        where: {
          isActive: true,
        },
        relations: ['tipoPago', 'subTipoPago'],
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.saldoRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['tipoPago', 'subTipoPago'],
      });
      if (!data)
        throw new BadRequestException(`No se encuentra con el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateSaldoDto: UpdateSaldoDto) {
    try {
      await this.findOne(id);
      await this.saldoRepository.update(id, updateSaldoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.saldoRepository.update(id, { isActive: false });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
