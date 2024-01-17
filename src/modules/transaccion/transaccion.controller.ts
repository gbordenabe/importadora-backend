import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { UpdateTransaccionDto } from './dto/update-transaccion.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { CreateFacturaDto } from '../factura/dto/create-factura.dto';
import { CreatePagoDto } from '../pagos/dto/create-pago.dto';
import { CreateSaldoDto } from '../saldos/dto/create-saldo.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('transaccion')
export class TransaccionController {
  constructor(private readonly transaccionService: TransaccionService) {}

  @Post()
  @Auth(ValidRoles.vendedor)
  create(
    @GetUser() user: User,
    @Body()
    createTransaccionGlobalDto: {
      createTransaccionDto: CreateTransaccionDto;
      createUsuarioDto: CreateUsuarioDto;
      createFacturaDto: CreateFacturaDto[];
      createPagoDto: CreatePagoDto[];
      createSaldoDto: CreateSaldoDto[];
    },
  ) {
    return this.transaccionService.create(user, createTransaccionGlobalDto);
  }

  @Get()
  findAll() {
    return this.transaccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transaccionService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateTransaccionDto: UpdateTransaccionDto,
  // ) {
  //   return this.transaccionService.update(id, updateTransaccionDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transaccionService.remove(id);
  }
}
