import {
  Body,
  Controller,
  Get,
  Head,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CashService } from '../services/cash.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/modules/user/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponseImplementation,
  ApiForbiddenResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { Cash } from '../entities/cash.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { UpdateCashDto } from '../dtos/update/update-cash.dto';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { ItemRequestToChangeDto } from '../dtos/update/item-request-to-change.dto';

@ApiTags('Cash')
@ApiBadRequestResponseImplementation()
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('cash')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @ApiOkResponseImplementation({ type: Cash })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return await this.cashService.findOneById({ id }, requestUser);
  }

  @ApiOkResponseImplementation({ type: Cash })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.cashService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Cash })
  @ApiNotFoundImplementation()
  @Auth()
  @Patch('mine/:id')
  async updateOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCashDto,
    @GetUser() requestUser: User,
  ) {
    return await this.cashService.updateOneById(id, dto, {
      requestUser,
      isAdministrator: false,
    });
  }

  @ApiOkResponseImplementation({ type: Cash })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCashDto,
    @GetUser() requestUser: User,
  ) {
    return await this.cashService.updateOneById(id, dto, {
      requestUser,
      isAdministrator: true,
    });
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Post('set-status-as-to-change/:id')
  async setStatusAsToChange(
    @Param('id', ParseIntPipe) id: number,
    @Body() itemRequestToChangeDto: ItemRequestToChangeDto,
    @GetUser() requestUser: User,
  ) {
    await this.cashService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.TO_CHANGE,
      requestUser,
      itemRequestToChangeDto.request_change_comment,
    );
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Head('set-status-as-ok/:id')
  async setStatusAsConfirmed(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    await this.cashService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.OK,
      requestUser,
    );
  }
}
