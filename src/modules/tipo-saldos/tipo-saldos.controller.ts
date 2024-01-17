import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSaldosService } from './tipo-saldos.service';
import { CreateTipoSaldoDto } from './dto/create-tipo-saldo.dto';
import { UpdateTipoSaldoDto } from './dto/update-tipo-saldo.dto';

@Controller('tipo-saldos')
export class TipoSaldosController {
  constructor(private readonly tipoSaldosService: TipoSaldosService) {}

  @Post()
  create(@Body() createTipoSaldoDto: CreateTipoSaldoDto) {
    return this.tipoSaldosService.create(createTipoSaldoDto);
  }

  @Get()
  findAll() {
    return this.tipoSaldosService.findAll();
  }
  @Get('send')
  send() {
    return this.tipoSaldosService.send();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoSaldosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoSaldoDto: UpdateTipoSaldoDto) {
    return this.tipoSaldosService.update(id, updateTipoSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoSaldosService.remove(id);
  }
}
