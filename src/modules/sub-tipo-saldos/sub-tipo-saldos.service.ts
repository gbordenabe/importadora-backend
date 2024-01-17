import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubTipoSaldoDto } from './dto/create-sub-tipo-saldo.dto';
import { UpdateSubTipoSaldoDto } from './dto/update-sub-tipo-saldo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTipoSaldo } from './entities/sub-tipo-saldo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubTipoSaldosService {
  constructor(
    @InjectRepository(SubTipoSaldo)
    private readonly subTipoSaldoRepository: Repository<SubTipoSaldo>,
  ) {}

  async send(): Promise<SubTipoSaldo[]> {
    try {
      const data = await this.findAll();
      if (data.length > 0) return data;
      const arrData = ['Financiero', 'Comercial', 'De Logistica'];

      const dataArrau = arrData.map(async (item: string) => {
        await this.create({ subTipo: item });
      });
      await Promise.all(dataArrau);
      return await this.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(
    createSubTipoSaldoDto: CreateSubTipoSaldoDto,
  ): Promise<SubTipoSaldo> {
    try {
      const data = await this.subTipoSaldoRepository.save(
        createSubTipoSaldoDto,
      );

      return await this.findOne(data.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<SubTipoSaldo[]> {
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

  async findOne(id: string): Promise<SubTipoSaldo> {
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
    updateSubTipoSaldoDto: UpdateSubTipoSaldoDto,
  ): Promise<SubTipoSaldo> {
    try {
      await this.findOne(id);
      await this.subTipoSaldoRepository.update(id, updateSubTipoSaldoDto);
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
