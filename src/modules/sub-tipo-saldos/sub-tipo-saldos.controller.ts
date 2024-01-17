import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubTipoSaldosService } from './sub-tipo-saldos.service';
import { CreateSubTipoSaldoDto } from './dto/create-sub-tipo-saldo.dto';
import { UpdateSubTipoSaldoDto } from './dto/update-sub-tipo-saldo.dto';

@Controller('sub-tipo-saldos')
export class SubTipoSaldosController {
  constructor(private readonly subTipoSaldosService: SubTipoSaldosService) {}

  @Post()
  create(@Body() createSubTipoSaldoDto: CreateSubTipoSaldoDto) {
    return this.subTipoSaldosService.create(createSubTipoSaldoDto);
  }

  @Get()
  findAll() {
    return this.subTipoSaldosService.findAll();
  }
  @Get('send')
  send() {
    return this.subTipoSaldosService.send();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subTipoSaldosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubTipoSaldoDto: UpdateSubTipoSaldoDto,
  ) {
    return this.subTipoSaldosService.update(id, updateSubTipoSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subTipoSaldosService.remove(id);
  }
}
