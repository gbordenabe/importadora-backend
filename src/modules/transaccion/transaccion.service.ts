import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { Repository, DeepPartial } from 'typeorm';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { CreateFacturaDto } from '../factura/dto/create-factura.dto';
import { CreatePagoDto } from '../pagos/dto/create-pago.dto';
import { CreateSaldoDto } from '../saldos/dto/create-saldo.dto';
import { User } from 'src/auth/entities/user.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PagosService } from '../pagos/pagos.service';
import { FacturaService } from '../factura/factura.service';
import { SaldosService } from '../saldos/saldos.service';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class TransaccionService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    private readonly usuarioRepository: UsuariosService,

    private readonly pagoRepository: PagosService,
    private readonly facturaRepository: FacturaService,
    private readonly saldoRepository: SaldosService,
  ) {}

  async create(
    user: User,
    createTransaccionGlobalDto: {
      createTransaccionDto: CreateTransaccionDto;
      createUsuarioDto: CreateUsuarioDto;
      createFacturaDto: CreateFacturaDto[];
      createPagoDto: CreatePagoDto[];
      createSaldoDto: CreateSaldoDto[];
    },
  ) {
    try {
      const {
        createTransaccionDto,
        createUsuarioDto,
        createFacturaDto,
        createPagoDto,
        createSaldoDto,
      } = createTransaccionGlobalDto;

      const usuario: Usuario =
        await this.usuarioRepository.create(createUsuarioDto);

      const factura = await Promise.all(
        createFacturaDto.map(async (item: CreateFacturaDto) => {
          const data = await this.facturaRepository.create(item);

          return data;
        }),
      );

      const pago = await Promise.all(
        createPagoDto.map(async (item: CreatePagoDto) => {
          return await this.pagoRepository.create(item);
        }),
      );

      const saldo = await Promise.all(
        createSaldoDto.map(async (item: CreateSaldoDto) => {
          return await this.saldoRepository.create(item);
        }),
      );

      const transaccion = await this.transaccionRepository.save({
        user,
        usuario,
        factura,
        pago,
        saldo,
        ...createTransaccionDto,
      });
      return await this.findOne(transaccion.id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Transaccion[]> {
    try {
      const data = await this.transaccionRepository.find({
        where: {
          isActive: true,
        },
        relations: ['user', 'usuario', 'factura', 'pago', 'saldo'],
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.transaccionRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: ['user', 'usuario', 'factura', 'pago', 'saldo'],
      });
      if (!data) throw new BadRequestException(`No existe el id:${id}`);
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // async update(id: string, updateTransaccionDto: UpdateTransaccionDto) {
  //   const { sku, clientId, empresaId, factura = [] } = updateTransaccionDto;
  //   try {
  //     // EMPRESA
  //     const empresa = await this.empresaRepository.findOne({
  //       where: { id: empresaId },
  //     });
  //     if (!empresa) throw new NotFoundException('No existe la empresa');

  //     //CLIENTE
  //     const cliente = await this.clienteRepository.findOne({
  //       where: { id: clientId },
  //     });
  //     if (!cliente) {
  //       throw new NotFoundException('No existe el cliente');
  //     }
  //     //Transaccion

  //     const Transaccion = await this.transaccionRepository.findOne({
  //       where: { id },
  //     });
  //     if (!Transaccion) {
  //       throw new NotFoundException('No existe el transaccion');
  //     }
  //     Object.assign(Transaccion, {
  //       sku,
  //       empresa,
  //       cliente,

  //       dateUpdate: new Date(),
  //     });
  //     await this.transaccionRepository.save(Transaccion);

  //     await Promise.all(
  //       factura.map(async (fact) => {
  //         if (fact?.id) {
  //           // Si existe el ID, intenta actualizar la factura existente
  //           const facturaExistente = await this.facturaRepository.findOne({
  //             where: { id: fact.id },
  //           });

  //           if (facturaExistente) {
  //             const tipo = await this.tipoFacturaRepository.findOne({
  //               where: { id: fact.idTipoFactura },
  //             });
  //             if (!tipo) {
  //               throw new NotFoundException('No existe el tipo de factura');
  //             }
  //             Object.assign(facturaExistente, {
  //               ...facturaExistente,
  //               amount: fact.amount,
  //               number: fact.number,
  //               obs: fact.obs,
  //               transacciones: Transaccion,
  //               dateUpdate: new Date(),
  //               tipoFact: tipo,
  //             });

  //             await this.facturaRepository.save(facturaExistente);
  //           } else {
  //             throw new NotFoundException(
  //               `No existe la factura con ID: ${fact.id}`,
  //             );
  //           }
  //         } else {
  //           // Si no existe el ID, crea una nueva factura
  //           const tipo = await this.tipoFacturaRepository.findOne({
  //             where: { id: fact.idTipoFactura },
  //           });
  //           if (!tipo) {
  //             throw new NotFoundException('No existe el tipo de factura');
  //           }
  //           const facturaNueva: DeepPartial<Factura> = {
  //             amount: fact.amount,
  //             number: fact.number,
  //             obs: fact.obs,
  //             transacciones: Transaccion,
  //             tipoFact: tipo,
  //           };

  //           await this.facturaRepository.save(facturaNueva);
  //         }
  //       }),
  //     );

  //     return this.findOne(id);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async remove(id: string): Promise<string> {
    try {
      await this.findOne(id);
      await this.transaccionRepository.update(id, {
        isActive: false,
        dateDelete: new Date(),
      });

      return `Se elimino el id:${id}`;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
