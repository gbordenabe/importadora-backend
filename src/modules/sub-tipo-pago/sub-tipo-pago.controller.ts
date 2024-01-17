import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubTipoPagoService } from './sub-tipo-pago.service';
import { CreateSubTipoPagoDto } from './dto/create-sub-tipo-pago.dto';
import { UpdateSubTipoPagoDto } from './dto/update-sub-tipo-pago.dto';

@Controller('sub-tipo-pago')
export class SubTipoPagoController {
  constructor(private readonly subTipoPagoService: SubTipoPagoService) {}

  @Post()
  create(@Body() createSubTipoPagoDto: CreateSubTipoPagoDto) {
    return this.subTipoPagoService.create(createSubTipoPagoDto);
  }

  @Get()
  findAll() {
    return this.subTipoPagoService.findAll();
  }

  @Get('send')
  send() {
    return this.subTipoPagoService.send();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subTipoPagoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubTipoPagoDto: UpdateSubTipoPagoDto,
  ) {
    return this.subTipoPagoService.update(id, updateSubTipoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subTipoPagoService.remove(id);
  }
}
