import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEstadoTransaccionDto } from './dto/create-estado-transaccion.dto';
import { UpdateEstadoTransaccionDto } from './dto/update-estado-transaccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoTransaccion } from './entities/estado-transaccion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoTransaccionService {
  constructor(
    @InjectRepository(EstadoTransaccion)
    private readonly estadoTransaccionRepository: Repository<EstadoTransaccion>,
  ) {}

  async send(): Promise<CreateEstadoTransaccionDto[]> {
    try {
      const data = [
        {
          title: 'Pendientes',
          obs: 'Son aquellas transacciones que fueron creadas y necesitan una revisión por parte de un Tesorero',
          color: '#629BF8',
        },
        {
          title: 'Con Solicitud de cambio',
          obs: 'Son aquellas transacciones que necesitan ser editadas por un Vendedor ya que la misma tiene algún error o necesita un archivo adjunto, etc.',
          color: '#D72F2F',
        },
        {
          title: 'Con edición',
          obs: 'Son aquellas transacciones o acciones que han sido editadas por un Vendedor o Tesorero.',
          color: '#FFE600',
        },
        {
          title: 'Aprobadas',
          obs: 'Son aquellas transacciones que han sido aprobadas en su totalidad por un Tesorero',
          color: '#89DC7F',
        },
      ];
      const validar = await this.findAll();
      if (validar.length > 0) return validar;

      const sendData = data.map(async (item: CreateEstadoTransaccionDto) => {
        await this.create(item);
      });
      await Promise.all(sendData);
      return await this.findAll();
    } catch (error) {
      return error;
    }
  }

  async create(
    createEstadoTransaccionDto: CreateEstadoTransaccionDto,
  ): Promise<CreateEstadoTransaccionDto> {
    try {
      const data = await this.estadoTransaccionRepository.save(
        createEstadoTransaccionDto,
      );
      delete data.isActive;
      return data;
    } catch (error) {
      return error;
    }
  }

  async findAll() {
    return await this.estadoTransaccionRepository.find({
      where: {
        isActive: true,
      },
      select: ['id', 'title', 'obs', 'color'],
    });
  }

  async findOne(id: string) {
    const data = await this.estadoTransaccionRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      select: ['id', 'title', 'obs', 'color'],
    });
    if (!data) throw new BadRequestException('No existe este dato');
    return data;
  }

  async update(
    id: string,
    updateEstadoTransaccionDto: UpdateEstadoTransaccionDto,
  ) {
    try {
      await this.findOne(id);
      await this.estadoTransaccionRepository.update(id, {
        ...updateEstadoTransaccionDto,
      });
      return this.findOne(id);
    } catch (error) {
      return error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.estadoTransaccionRepository.update(id, { isActive: false });
      return;
    } catch (error) {
      return error;
    }
  }
}
