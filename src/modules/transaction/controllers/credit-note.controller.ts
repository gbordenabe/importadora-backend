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
import { CreditNoteService } from '../services/credit-note.service';
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
import { CreditNote } from '../entities/credit-note.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { UpdateCreditNoteDto } from '../dtos/update/update-credit-note.dto';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { ItemRequestToChangeDto } from '../dtos/update/item-request-to-change.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('CreditNote')
@ApiBadRequestResponseImplementation()
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('creditNote')
export class CreditNoteController {
  constructor(private readonly creditNoteService: CreditNoteService) {}

  @ApiOkResponseImplementation({ type: CreditNote })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return await this.creditNoteService.findOneById({ id }, requestUser);
  }

  @ApiOkResponseImplementation({ type: CreditNote })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.creditNoteService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: CreditNote })
  @ApiNotFoundImplementation()
  @Auth()
  @Patch('mine/:id')
  async updateOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditNoteDto,
    @GetUser() requestUser: User,
  ) {
    return await this.creditNoteService.updateOneById(id, dto, {
      requestUser,
      isAdministrator: false,
    });
  }

  @ApiOkResponseImplementation({ type: CreditNote })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCreditNoteDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() requestUser: User,
  ) {
    return await this.creditNoteService.updateOneById(id, dto, {
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
    await this.creditNoteService.setStatus(
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
    await this.creditNoteService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.OK,
      requestUser,
    );
  }
}
