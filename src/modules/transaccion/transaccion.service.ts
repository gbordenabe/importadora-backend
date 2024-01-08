import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaccion } from './entities/transaccion.entity';
import { Repository, DeepPartial } from 'typeorm';
import { Cliente } from '../cliente/entities/cliente.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { Factura } from '../factura/entities/factura.entity';
import { TipoFactura } from '../tipo-factura/entities/tipo-factura.entity';

@Injectable()
export class TransaccionService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    @InjectRepository(TipoFactura)
    private readonly tipoFacturaRepository: Repository<TipoFactura>,
  ) {}

  // async create(createTransaccionDto: CreateTransaccionDto) {
  //   try {
  //     const { sku, clientId, empresaId, factura = [] } = createTransaccionDto;

  //     //EMPRESA
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

  //     //FACTURA CREACION
  //     const transaccionCreate = this.transaccionRepository.create({
  //       sku,
  //       cliente: cliente,
  //       empresa: empresa,
  //       factura: factura.map((fact) =>
  //         this.facturaRepository.create({
  //           amount: fact.amount,
  //           number: fact.number,
  //           obs: fact.obs,
  //         }),
  //       ),
  //     });

  //     // const transaccion = this.transaccionRepository.create({
  //     //   sku,
  //     //   cliente: cliente,
  //     //   empresa: empresa,
  //     //   factura: factura.map((fact) =>
  //     //     this.facturaRepository.create({ id: fact }),
  //     //   ),
  //     // });
  //     // await this.transaccionRepository.save(transaccion);
  //     // return transaccion;

  //     return
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async create(createTransaccionDto: CreateTransaccionDto) {
    try {
      const { sku, clientId, empresaId, factura = [] } = createTransaccionDto;

      // EMPRESA
      const empresa = await this.empresaRepository.findOne({
        where: { id: empresaId },
      });
      if (!empresa) throw new NotFoundException('No existe la empresa');

      //CLIENTE
      const cliente = await this.clienteRepository.findOne({
        where: { id: clientId },
      });
      if (!cliente) {
        throw new NotFoundException('No existe el cliente');
      }

      // Crear y guardar la transacción
      const transaccionCreate: DeepPartial<Transaccion> = {
        sku,
        cliente,
        empresa,
        factura: factura.map((fact) => ({ ...fact, transaccion: undefined })), // Usar "factura" en lugar de "facturas"
      };

      const transaccionGuardada =
        await this.transaccionRepository.save(transaccionCreate);
      let subTotalFactura: number = 0;
      // Asignar el ID de la transacción a las facturas y guardarlas
      await Promise.all(
        factura.map(async (fact) => {
          const tipo = await this.tipoFacturaRepository.findOne({
            where: { id: fact.idTipoFactura },
          });
          if (!tipo)
            throw new NotFoundException('No existe el tipo de factura');
          subTotalFactura = subTotalFactura + fact.amount;
          const facturaCreate: DeepPartial<Factura> = {
            amount: fact.amount,
            number: fact.number,
            obs: fact.obs,
            transacciones: transaccionGuardada,
            tipoFact: tipo,
          };
          return await this.facturaRepository.save(facturaCreate);
        }),
      );
      const model = {
        subTotalFactura: subTotalFactura,
        ...transaccionCreate,
      };
      // Devolver la transacción creada
      // return transaccionGuardada;
      // return model;
      return this.findOne('c08c583e-a07d-409d-91b8-40544928e93e');
    } catch (error) {
      throw error;
    }
  }

  // async findAll() {
  //   const getTransaccionAll = await this.transaccionRepository.find({
  //     where: { isActive: true },
  //     relations: ['cliente', 'empresa'],
  //   });
  //   return getTransaccionAll;
  // }

  async findAll(): Promise<Transaccion[]> {
    const transacciones = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .leftJoinAndSelect('transaccion.cliente', 'cliente')
      .leftJoinAndSelect('transaccion.empresa', 'empresa')
      .leftJoinAndSelect('transaccion.factura', 'factura')
      .leftJoinAndSelect('factura.tipoFact', 'tipoFact')
      .select([
        'transaccion.id',
        'transaccion.sku',
        'transaccion.isActive',
        'transaccion.dateCreate',
        'transaccion.dateUpdate',
        'transaccion.dateDelete',
        'cliente',
        'empresa',
        'factura',
        'tipoFact',
      ])
      .getMany();
    // Modificar la respuesta antes de enviarla al cliente
    const transaccionesConTipoFact = transacciones?.map(
      (transaccion: Transaccion) => {
        let data: any = { ...transaccion };
        let subTotalFactura: number = 0;

        if (data.factura) {
          data.factura = data.factura.map((factura: Factura) => {
            const { tipoFact, ...facturaWithoutTipoFact } = factura;
            console.log(facturaWithoutTipoFact.amount);

            // Sumar al subTotalFactura
            subTotalFactura += facturaWithoutTipoFact.amount;

            return {
              ...facturaWithoutTipoFact,
              tipoFact: tipoFact?.name || 'Sin Tipo',
            };
          });
        }

        // Convertir subTotalFactura a número antes de devolver la respuesta
        return { ...data, subTotalFactura: Number(subTotalFactura) };
      },
    );

    return transaccionesConTipoFact;
  }
  async findOne(id: string) {
    // const getTransaccionOne = await this.transaccionRepository.find({
    //   where: {
    //     id,
    //     isActive: true,
    //   },
    //   relations: ['cliente', 'empresa'],
    // });
    // if (!getTransaccionOne) {
    //   throw new NotFoundException(`No se encuentra la transacción ${id}`);
    // }
    // return getTransaccionOne;

    const transaccion = await this.transaccionRepository
      .createQueryBuilder('transaccion')
      .leftJoinAndSelect('transaccion.cliente', 'cliente')
      .leftJoinAndSelect('transaccion.empresa', 'empresa')
      .leftJoinAndSelect('transaccion.factura', 'factura')
      .leftJoinAndSelect('factura.tipoFact', 'tipoFact')
      .select([
        'transaccion.id',
        'transaccion.sku',
        'transaccion.isActive',
        'transaccion.dateCreate',
        'transaccion.dateUpdate',
        'transaccion.dateDelete',
        'cliente',
        'empresa',
        'factura',
        'tipoFact',
      ])
      .where('transaccion.id = :id', { id })
      .getOne();

    let data: any = { ...transaccion };
    let subTotalFactura: number = 0;

    if (data.factura) {
      data.factura = data.factura.map((factura: Factura) => {
        const { tipoFact, ...facturaWithoutTipoFact } = factura;
        console.log(facturaWithoutTipoFact.amount);

        // Sumar al subTotalFactura
        subTotalFactura += facturaWithoutTipoFact.amount;

        return {
          ...facturaWithoutTipoFact,
          tipoFact: tipoFact?.name || 'Sin Tipo',
        };
      });
    }

    // Convertir subTotalFactura a número antes de devolver la respuesta
    return { ...data, subTotalFactura: Number(subTotalFactura) };

    // return transaccion;
  }

  async update(id: string, updateTransaccionDto: UpdateTransaccionDto) {
    const { sku, clientId, empresaId, factura = [] } = updateTransaccionDto;
    try {
      // EMPRESA
      const empresa = await this.empresaRepository.findOne({
        where: { id: empresaId },
      });
      if (!empresa) throw new NotFoundException('No existe la empresa');

      //CLIENTE
      const cliente = await this.clienteRepository.findOne({
        where: { id: clientId },
      });
      if (!cliente) {
        throw new NotFoundException('No existe el cliente');
      }
      //Transaccion

      const Transaccion = await this.transaccionRepository.findOne({
        where: { id },
      });
      if (!Transaccion) {
        throw new NotFoundException('No existe el transaccion');
      }
      Object.assign(Transaccion, {
        sku,
        empresa,
        cliente,

        dateUpdate: new Date(),
      });
      await this.transaccionRepository.save(Transaccion);

      await Promise.all(
        factura.map(async (fact) => {
          if (fact?.id) {
            // Si existe el ID, intenta actualizar la factura existente
            const facturaExistente = await this.facturaRepository.findOne({
              where: { id: fact.id },
            });

            if (facturaExistente) {
              const tipo = await this.tipoFacturaRepository.findOne({
                where: { id: fact.idTipoFactura },
              });
              if (!tipo) {
                throw new NotFoundException('No existe el tipo de factura');
              }
              Object.assign(facturaExistente, {
                ...facturaExistente,
                amount: fact.amount,
                number: fact.number,
                obs: fact.obs,
                transacciones: Transaccion,
                dateUpdate: new Date(),
                tipoFact: tipo,
              });

              await this.facturaRepository.save(facturaExistente);
            } else {
              throw new NotFoundException(
                `No existe la factura con ID: ${fact.id}`,
              );
            }
          } else {
            // Si no existe el ID, crea una nueva factura
            const tipo = await this.tipoFacturaRepository.findOne({
              where: { id: fact.idTipoFactura },
            });
            if (!tipo) {
              throw new NotFoundException('No existe el tipo de factura');
            }
            const facturaNueva: DeepPartial<Factura> = {
              amount: fact.amount,
              number: fact.number,
              obs: fact.obs,
              transacciones: Transaccion,
              tipoFact: tipo,
            };

            await this.facturaRepository.save(facturaNueva);
          }
        }),
      );

      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.transaccionRepository.update(id, {
        isActive: false,
        dateDelete: new Date(),
      });
      const getTransaccionAll = await this.findAll();
      return getTransaccionAll;
    } catch (error) {
      throw error;
    }
  }
}
