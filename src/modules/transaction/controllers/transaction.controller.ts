import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateTransactionDto } from '../dtos/create/create-transaction.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  async findAll(
    @Body() filters: FindAllTransactionsAsTreasureDto,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNumber = page > 0 ? page : 1;
    const limitNumber = limit > 0 ? limit : 10;

    return await this.transactionService.findAll({
      filters,
      page: pageNumber,
      limit: limitNumber,
    });
  }

  @ApiOkResponseImplementation({
    type: FindAndCountTransactionsDto,
  })
  @Auth()
  @Post('get-all/mine')
  async findAllOfMine(
    @Body() filters: FindAllTransactionsDto,
    @GetUser() requestUser: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const pageNumber = page > 0 ? page : 1;
    const limitNumber = limit > 0 ? limit : 10;
    return await this.transactionService.findAll({
      filters,
      requestUser,
      page: pageNumber,
      limit: limitNumber,
    });
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
  @ApiOkResponse({ type: Transaction, isArray: true })
  @ApiOperation({
    summary: 'Busca todos las transacciones del usuario logueado',
    description:
      'Se envia por el QueryParam el monto de la transacción que se quiere buscar ejemplo: /transaction/amount-all?amount=1000',
  })
  @ApiNotFoundImplementation()
  @Auth()
  @Get('amount')
  async findByAmount(
    @Query('amount', ParseIntPipe) amount: number,
    @GetUser() user: User,
  ): Promise<Transaction[]> {
    return await this.transactionService.findAmounts(amount, user);
  }

  @ApiOkResponseImplementation({ type: Transaction })
  @ApiOkResponse({ type: Transaction, isArray: true })
  @ApiOperation({
    summary: 'Busca todos las transacciones de todos los vendedores',
    description:
      'Se envia por el QueryParam el monto de la transacción que se quiere buscar ejemplo: /transaction/amount-all?amount=1000',
  })
  @ApiNotFoundImplementation()
  @Auth(ROLE_NAME_ENUM.TREASURER)
  @Get('amount-all')
  async findByAmountAll(
    @Query('amount', ParseIntPipe) amount: number,
  ): Promise<Transaction[]> {
    return await this.transactionService.findAmounts(amount);
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
