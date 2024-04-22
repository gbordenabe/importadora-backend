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
import { CreditService } from '../services/credit.service';
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
import { Credit } from '../entities/credit.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { UpdateCreditDto } from '../dtos/update/update-credit.dto';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { ItemRequestToChangeDto } from '../dtos/update/item-request-to-change.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Credit')
@ApiBadRequestResponseImplementation()
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @ApiOkResponseImplementation({ type: Credit })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return await this.creditService.findOneById({ id }, requestUser);
  }

  @ApiOkResponseImplementation({ type: Credit })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.creditService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Credit })
  @ApiNotFoundImplementation()
  @Auth()
  @Patch('mine/:id')
  async updateOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditDto,
    @GetUser() requestUser: User,
  ) {
    return await this.creditService.updateOneById(id, dto, {
      requestUser,
      isAdministrator: false,
    });
  }

  @ApiOkResponseImplementation({ type: Credit })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() requestUser: User,
  ) {
    return await this.creditService.updateOneById(id, dto, {
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
    await this.creditService.setStatus(
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
    await this.creditService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.OK,
      requestUser,
    );
  }
}
