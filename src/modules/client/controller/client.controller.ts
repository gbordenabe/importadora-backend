import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { ClientService } from '../services/client.service';
import {
  ApiBadRequestResponseImplementation,
  ApiCreatedResponseImplementation,
  ApiForbiddenResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindAndCountClientsDto } from '../dto/find-and-count-clients.dto';
import { Client } from '../entities/client.entity';
import { Auth } from 'src/auth/decorators';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { FindAllClientsQueryDto } from '../dto/find-all-clients-query.dto';

@ApiTags('Client')
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@ApiBadRequestResponseImplementation()
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({
    summary: 'Get all clients',
    description: `Obtaining array clients`,
  })
  @ApiOkResponseImplementation({
    type: FindAndCountClientsDto,
  })
  @Auth()
  @Get()
  async findAll(@Query() queryParams: FindAllClientsQueryDto) {
    return await this.clientService.findAll(queryParams);
  }

  @ApiOperation({
    summary: 'Se obtiene clientes',
    description: `se obtiene clientes por queryparams ejemplo client/one-client?client=1234 Cliente`,
  })
  @ApiOkResponseImplementation({
    type: Client,
  })
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get('/one-client')
  async findOne(@Query('client') client: string) {
    return await this.clientService.findOneClient(client);
  }

  @ApiCreatedResponseImplementation(Client)
  @ApiOperation({
    summary: 'Create client',
    description: `Obtaining client created`,
  })
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Post()
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientService.create(createClientDto);
  }

  @ApiOkResponseImplementation({ type: Client })
  @ApiOperation({
    summary: 'Get client by id',
    description: `Obtaining client by id`,
  })
  @ApiNotFoundImplementation()
  @Auth()
  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.clientService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Client })
  @ApiOperation({
    summary: 'Update client by id',
    description: `Updated client by id`,
  })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    return this.clientService.updateOneById(id, updateClientDto);
  }

  @ApiOkResponseImplementation()
  @ApiOperation({
    summary: 'Delete client by id',
    description: `deleted client by id`,
  })
  @ApiForbiddenResponseImplementation()
  @ApiNotFoundImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientService.removeOneById(id);
  }
}
