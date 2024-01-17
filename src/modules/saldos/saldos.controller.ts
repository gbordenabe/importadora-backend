import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SaldosService } from './saldos.service';
import { CreateSaldoDto } from './dto/create-saldo.dto';
import { UpdateSaldoDto } from './dto/update-saldo.dto';

@Controller('saldos')
export class SaldosController {
  constructor(private readonly saldosService: SaldosService) {}

  @Post()
  create(@Body() createSaldoDto: CreateSaldoDto) {
    return this.saldosService.create(createSaldoDto);
  }

  @Get()
  findAll() {
    return this.saldosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saldosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaldoDto: UpdateSaldoDto) {
    return this.saldosService.update(id, updateSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saldosService.remove(id);
  }
}
