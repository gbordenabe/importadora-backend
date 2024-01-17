import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipoSaldoDto } from './dto/create-tipo-saldo.dto';
import { UpdateTipoSaldoDto } from './dto/update-tipo-saldo.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoSaldo } from './entities/tipo-saldo.entity';

@Injectable()
export class TipoSaldosService {
  constructor(
    @InjectRepository(TipoSaldo)
    private readonly subTipoSaldoRepository: Repository<TipoSaldo>,
  ) {}

  async send(): Promise<TipoSaldo[]> {
    try {
      const data = await this.findAll();
      if (data.length > 0) return data;
      const arrData = ['Credito', 'Nota de credito', 'Retenciones'];

      const dataArrau = arrData.map(async (item: string) => {
        await this.create({ tipo: item });
      });
      await Promise.all(dataArrau);
      return await this.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createTipoSaldoDto: CreateTipoSaldoDto): Promise<TipoSaldo> {
    try {
      const data = await this.subTipoSaldoRepository.save(createTipoSaldoDto);

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<TipoSaldo[]> {
    try {
      const data = await this.subTipoSaldoRepository.find({
        where: {
          isActive: true,
        },
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<TipoSaldo> {
    try {
      const data = await this.subTipoSaldoRepository.findOne({
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
    updateTipoSaldoDto: UpdateTipoSaldoDto,
  ): Promise<TipoSaldo> {
    try {
      await this.findOne(id);
      await this.subTipoSaldoRepository.update(id, updateTipoSaldoDto);
      return await this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.subTipoSaldoRepository.update(id, { isActive: false });
      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
