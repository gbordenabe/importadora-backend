import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateTransactionDto } from '../dtos/create/create-transaction.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiBadRequestResponseImplementation,
  ApiCreatedResponseImplementation,
  ApiForbiddenResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
  ApiUnauthorizedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { FindAndCountTransactionsDto } from '../dtos/response/find-and-count-transactions.dto';
import { Transaction } from '../entities/transaction.entity';
import { FindAllTransactionsAsTreasureDto } from '../dtos/query/find-all-transactions-as-treasure.dto';
import { FindAllTransactionsDto } from '../dtos/query/find-all-transactions.dto';
import { ParseTransactionItemFileValidation } from 'src/storage-service/pipe/file-validation.pipe';
@ApiTags('Transaction')
@ApiUnauthorizedResponseImplementation()
@ApiBadRequestResponseImplementation()
@ApiBearerAuth()
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponseImplementation({
    type: FindAndCountTransactionsDto,
  })
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Post('get-all')
  async findAll(@Body() filters: FindAllTransactionsAsTreasureDto) {
    return await this.transactionService.findAll(filters);
  }

  @ApiOkResponseImplementation({
    type: FindAndCountTransactionsDto,
  })
  @Auth()
  @Post('get-all/mine')
  async findAllOfMine(
    @Body() filters: FindAllTransactionsDto,
    @GetUser() requestUser: User,
  ) {
    return await this.transactionService.findAll(filters, requestUser);
  }

  @ApiCreatedResponseImplementation(Transaction)
  @ApiNotFoundImplementation()
  @Auth()
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @UploadedFiles(ParseTransactionItemFileValidation)
    files: Express.Multer.File[],
    @GetUser() user: User,
  ) {
    return await this.transactionService.create(dto, files, user);
  }

  @ApiOkResponseImplementation({ type: Transaction })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('mine/:id')
  async findOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return await this.transactionService.findOneById({ id }, user);
  }

  @ApiOkResponseImplementation({ type: Transaction })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.transactionService.findOneById({ id });
  }

  @ApiOkResponseImplementation({
    method: 'delete',
  })
  @ApiNotFoundImplementation()
  @Auth()
  @Delete('mine/:id')
  async removeOneOfMineById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    await this.transactionService.removeOneById(id, user);
  }

  @ApiOkResponseImplementation({
    method: 'delete',
  })
  @ApiNotFoundImplementation()
  @ApiForbiddenResponseImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Delete(':id')
  async removeOneById(@Param('id', ParseIntPipe) id: number) {
    await this.transactionService.removeOneById(id);
  }
}
