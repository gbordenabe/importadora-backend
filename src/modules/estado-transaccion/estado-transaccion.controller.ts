import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstadoTransaccionService } from './estado-transaccion.service';
import { CreateEstadoTransaccionDto } from './dto/create-estado-transaccion.dto';
import { UpdateEstadoTransaccionDto } from './dto/update-estado-transaccion.dto';

@Controller('estado-transaccion')
export class EstadoTransaccionController {
  constructor(
    private readonly estadoTransaccionService: EstadoTransaccionService,
  ) {}

  @Post()
  create(@Body() createEstadoTransaccionDto: CreateEstadoTransaccionDto) {
    return this.estadoTransaccionService.create(createEstadoTransaccionDto);
  }

  @Get()
  findAll() {
    return this.estadoTransaccionService.findAll();
  }

  @Get('send')
  send() {
    return this.estadoTransaccionService.send();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadoTransaccionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstadoTransaccionDto: UpdateEstadoTransaccionDto,
  ) {
    return this.estadoTransaccionService.update(id, updateEstadoTransaccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadoTransaccionService.remove(id);
  }
}
