import {
  Body,
  Controller,
  Get,
  Head,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BillService } from '../services/bill.service';
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
import { Bill } from '../entities/bill.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { UpdateBillDto } from '../dtos/update/update-bill.dto';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { ItemRequestToChangeDto } from '../dtos/update/item-request-to-change.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Bill')
@ApiBadRequestResponseImplementation()
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @ApiOkResponseImplementation({ type: Bill })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return await this.billService.findOneById({ id }, requestUser);
  }

  @ApiOkResponseImplementation({ type: Bill })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.billService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Bill })
  @ApiNotFoundImplementation()
  @Auth()
  @Patch('mine/:id')
  async updateOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBillDto,
    @GetUser() requestUser: User,
  ) {
    return await this.billService.updateOneById(id, dto, {
      requestUser,
      isAdministrator: false,
    });
  }

  @ApiOkResponseImplementation({ type: Bill })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateBillDto,
    @GetUser() requestUser: User,
  ) {
    return await this.billService.updateOneById(id, dto, {
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
    await this.billService.setStatus(
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
    await this.billService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.OK,
      requestUser,
    );
  }
}
