import {
  Body,
  Controller,
  Delete,
  Get,
  Head,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RetentionService } from '../services/retention.service';
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
import { Retention } from '../entities/retention.entity';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { UpdateRetentionDto } from '../dtos/update/update-retention.dto';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { ItemRequestToChangeDto } from '../dtos/update/item-request-to-change.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseTransactionItemFileValidation } from 'src/storage-service/pipe/file-validation.pipe';

@ApiTags('Retention')
@ApiBadRequestResponseImplementation()
@ApiUnauthorizedResponseImplementation()
@ApiBearerAuth()
@Controller('retention')
export class RetentionController {
  constructor(private readonly retentionService: RetentionService) {}

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/file/:cashId')
  async getMyFileByCashId(
    @Param('cashId', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return new StreamableFile(
      await this.retentionService.getFileByRetentionId(id, {
        requestUser,
        isAdministrator: false,
      }),
    );
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get('file/:cashId')
  async getFileByCashId(
    @Param('cashId', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return new StreamableFile(
      await this.retentionService.getFileByRetentionId(id, {
        requestUser,
        isAdministrator: true,
      }),
    );
  }

  @ApiOkResponseImplementation({ type: Retention })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    return await this.retentionService.findOneById({ id }, requestUser);
  }

  @ApiOkResponseImplementation({ type: Retention })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.retentionService.findOneById({ id });
  }

  @ApiOkResponseImplementation({ type: Retention })
  @ApiNotFoundImplementation()
  @UseInterceptors(FileInterceptor('file'))
  @Auth()
  @Patch('mine/:id')
  async updateOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetentionDto,
    @UploadedFile(ParseTransactionItemFileValidation) file: Express.Multer.File,
    @GetUser() requestUser: User,
  ) {
    return await this.retentionService.updateOneById(
      id,
      dto,
      {
        requestUser,
        isAdministrator: false,
      },
      file,
    );
  }

  @ApiOkResponseImplementation({ type: Retention })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @UseInterceptors(FileInterceptor('file'))
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Patch(':id')
  async updateOneById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetentionDto,
    @GetUser() requestUser: User,
    @UploadedFile(ParseTransactionItemFileValidation) file: Express.Multer.File,
  ) {
    return await this.retentionService.updateOneById(
      id,
      dto,
      {
        requestUser,
        isAdministrator: true,
      },
      file,
    );
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
    await this.retentionService.setStatus(
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
    await this.retentionService.setStatus(
      id,
      TRANSACTION_STATUS_ENUM.OK,
      requestUser,
    );
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @Auth()
  @Delete('mine/file/:retentionId')
  async deleteMyFileByCashId(
    @Param('retentionId', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    await this.retentionService.deleteFileByRetentionId(id, {
      isAdministrator: false,
      requestUser,
    });
  }

  @ApiOkResponseImplementation()
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Delete('file/:retentionId')
  async deleteFileByCashId(
    @Param('retentionId', ParseIntPipe) id: number,
    @GetUser() requestUser: User,
  ) {
    await this.retentionService.deleteFileByRetentionId(id, {
      isAdministrator: true,
      requestUser,
    });
  }
}
