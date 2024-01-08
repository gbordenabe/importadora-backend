import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoFacturaService } from '../service/tipo-factura.service';
import { CreateTipoFacturaDto } from '../dto/create/create-tipo-factura.dto';
import { UpdateTipoFacturaDto } from '../dto/update/update-tipo-factura.dto';

@Controller('tipo-factura')
export class TipoFacturaController {
  constructor(private readonly tipoFacturaService: TipoFacturaService) {}

  @Post()
  create(@Body() createTipoFacturaDto: CreateTipoFacturaDto) {
    return this.tipoFacturaService.create(createTipoFacturaDto);
  }

  @Get()
  findAll() {
    return this.tipoFacturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoFacturaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoFacturaDto: UpdateTipoFacturaDto) {
    return this.tipoFacturaService.update(id, updateTipoFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoFacturaService.remove(id);
  }
}
