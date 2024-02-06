import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponseImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { Role } from './entities/role.entity';

@ApiTags('Role')
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOkResponseImplementation({ type: [Role] })
  @Get()
  async findAll() {
    return await this.roleService.findAll();
  }

  @ApiOkResponseImplementation({ type: Role })
  @ApiBadRequestResponseImplementation()
  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return await this.roleService.findOneById(id);
  }
}
