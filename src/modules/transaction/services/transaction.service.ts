import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  IFindAndCountResult,
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';
import { CreateTransactionDto } from '../dtos/create/create-transaction.dto';
import { CompanyService } from 'src/modules/company/services/company.service';
import { checkDtos, checkFk } from 'src/common/helpers/check-references.helper';
import { Company } from 'src/modules/company/entities/company.entity';
import { BillService } from './bill.service';
import { CheckService } from './check.service';
import { ClientService } from 'src/modules/client/services/client.service';
import { Bill } from '../entities/bill.entity';
import { CreateBillDto } from '../dtos/create/create-bill.dto';
import { Client } from 'src/modules/client/entities/client.entity';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { setLogs } from 'src/common/helpers/set-logs.helper';
import { User } from 'src/modules/user/entities/user.entity';
import { userRelations } from 'src/modules/user/user.service';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { getOptionalUser } from 'src/common/helpers/get-optional-user.helper';
import { FindAllTransactionsAsTreasureDto } from '../dtos/query/find-all-transactions-as-treasure.dto';
import {
  setDateRangeInQueryBuilder,
  setFieldInQueryBuilder,
  setOrderOnQueryBuilder,
  setRangeInQueryBuilder,
  setRelationsOnQueryBuilder,
  setWhereEqualInQueryBuilder,
} from '../helpers/find-all-transactions.helper';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { TRANSACTION_ORDER_BY_ENUM } from '../dtos/enum/transaction-order-by.enum';
import { CashService } from './cash.service';
import { DepositService } from './deposit.service';
import { CreditService } from './credit.service';
import { RetentionService } from './retention.service';
import { CreditNoteService } from './credit-note.service';
import { CreateCashDto } from '../dtos/create/create-cash.dto';
import { Cash } from '../entities/cash.entity';
import { Check } from '../entities/check.entity';
import { CreateCheckDto } from '../dtos/create/create-check.dto';
import { CreditNote } from '../entities/credit-note.entity';
import { CreateCreditNoteDto } from '../dtos/create/create-credit-note.dto';
import { Credit } from '../entities/credit.entity';
import { CreateCreditDto } from '../dtos/create/create-credit.dto';
import { Deposit } from '../entities/deposit.entity';
import { CreateDepositDto } from '../dtos/create/create-deposit.dto';
import { CreateRetentionDto } from '../dtos/create/create-retention.dto';
import { Retention } from '../entities/retention.entity';
import { IItemTransaction } from '../entities/interfaces/transaction-item.interface';
import { LogFields } from 'src/common/entities/log-fields';

@Injectable()
export class TransactionService
  implements
    Omit<
      IServiceInterface<
        Transaction,
        CreateTransactionDto,
        CreateTransactionDto
      >,
      'updateOneById'
    >
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly companyService: CompanyService,
    private readonly billService: BillService,
    private readonly checkService: CheckService,
    private readonly cashService: CashService,
    private readonly depositService: DepositService,
    private readonly creditService: CreditService,
    private readonly retentionService: RetentionService,
    private readonly creditNoteService: CreditNoteService,
    private readonly clientService: ClientService,
  ) {}
  async rawSave(transaction: Transaction) {
    await this.transactionRepository.save(transaction);
  }

  async findAll(
    filters: Partial<FindAllTransactionsAsTreasureDto>,
    requestUser?: User,
  ): Promise<IFindAndCountResult<Transaction>> {
    const {
      bill_amount_min,
      bill_number,
      bill_status,
      clients,
      companies,
      created_at_end,
      created_at_start,
      order = ORDER_ENUM.ASC,
      order_by = TRANSACTION_ORDER_BY_ENUM.ID,
      cash_amount_min,
      cash_document_number,
      cash_status,
      check_amount_min,
      check_document_number,
      check_status,
      credit_amount_min,
      credit_note_amount_min,
      credit_note_status,
      credit_status,
      deposit_amount_min,
      deposit_document_number,
      deposit_status,
      retention_amount_min,
      retention_status,
      sellers,
      statuses,
    } = filters;
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('transaction');
    setRelationsOnQueryBuilder(queryBuilder);
    setOrderOnQueryBuilder({
      order,
      orderBy: order_by,
      queryBuilder,
    });
    setFieldInQueryBuilder({
      field: 'created_by.id',
      values: sellers,
      queryBuilder,
    });
    setFieldInQueryBuilder({
      field: 'client.id',
      values: clients,
      queryBuilder,
    });
    setFieldInQueryBuilder({
      field: 'company.id',
      values: companies,
      queryBuilder,
    });
    setFieldInQueryBuilder({
      field: 'transaction.status',
      values: statuses,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'bills.amount',
      start: bill_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'bills.number',
      value: bill_number,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'bills.status',
      value: bill_status,
      queryBuilder,
    });
    setDateRangeInQueryBuilder({
      field: 'transaction.created_at',
      start: created_at_start,
      end: created_at_end,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'cash.amount',
      start: cash_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'cash.document_number',
      value: cash_document_number,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'cash.status',
      value: cash_status,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'checks.amount',
      start: check_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'checks.document_number',
      value: check_document_number,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'checks.status',
      value: check_status,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'credit_notes.amount',
      start: credit_note_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'credit_notes.status',
      value: credit_note_status,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'credits.amount',
      start: credit_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'credits.status',
      value: credit_status,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'deposits.amount',
      start: deposit_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'deposits.document_number',
      value: deposit_document_number,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'deposits.status',
      value: deposit_status,
      queryBuilder,
    });
    setRangeInQueryBuilder({
      field: 'retentions.amount',
      start: retention_amount_min,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'retentions.status',
      value: retention_status,
      queryBuilder,
    });
    setWhereEqualInQueryBuilder({
      field: 'created_by.id',
      value: requestUser?.id,
      queryBuilder,
    });
    const [data, count] = await queryBuilder.getManyAndCount();
    return { data, count };
  }
  entityName: string = Transaction.name;
  private readonly itemTransactionRelations: FindOptionsRelations<
    IItemTransaction & LogFields
  > = {
    approving_treasurer: userRelations,
    created_by: userRelations,
    updated_by: userRelations,
  };
  relations: FindOptionsRelations<Transaction> = {
    company: true,
    client: true,
    created_by: userRelations,
    updated_by: userRelations,
    bills: this.itemTransactionRelations,
    cash: this.itemTransactionRelations,
    checks: this.itemTransactionRelations,
    credit_notes: this.itemTransactionRelations,
    credits: this.itemTransactionRelations,
    deposits: this.itemTransactionRelations,
    retentions: this.itemTransactionRelations,
  };
  findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.findOne({
      where: { id, created_by: getOptionalUser(requestUser) },
      relations: relations ? this.relations : [],
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    return transaction;
  }
  private setTransactionLogsBeforeToSave(
    transaction: Transaction,
    requestUser: User,
  ) {
    setLogs({ entity: transaction, createdBy: requestUser });
    setLogs({ entity: transaction.bills, createdBy: requestUser });
    setLogs({ entity: transaction.cash, createdBy: requestUser });
    setLogs({ entity: transaction.checks, createdBy: requestUser });
    setLogs({ entity: transaction.credit_notes, createdBy: requestUser });
    setLogs({ entity: transaction.credits, createdBy: requestUser });
    setLogs({ entity: transaction.deposits, createdBy: requestUser });
    setLogs({ entity: transaction.retentions, createdBy: requestUser });
  }
  async create(
    dto: CreateTransactionDto,
    requestUser: User,
  ): Promise<Transaction> {
    const dtoVerified = await this.getAndVerifyDto(dto);
    console.log({ requestUser });
    this.setTransactionLogsBeforeToSave(dtoVerified, requestUser);
    console.log({
      dtoVerified: JSON.stringify(dtoVerified, null, 2),
    });
    this.handleInitialStatus(dtoVerified);
    try {
      return await this.transactionRepository.save(dtoVerified);
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async removeOneById(id: number, requestUser?: User): Promise<void> {
    await this.findOneById({ id, relations: false }, requestUser);
    await this.transactionRepository.update(id, { is_active: false });
  }

  async getAndVerifyDto(
    dto: Partial<CreateTransactionDto> = {},
  ): Promise<Transaction> {
    const {
      bills: billsDto,
      cash: cashDto,
      checks: checksDto,
      credit_notes: creditNotesDto,
      credits: creditsDto,
      deposits: depositsDto,
      retentions: retentionsDto,
      clientId,
      companyId,
      ...rest
    } = dto;
    const [
      company,
      client,
      bills,
      cash,
      checks,
      creditNotes,
      credits,
      deposits,
      retentions,
    ] = await Promise.all([
      checkFk<Company>({
        service: this.companyService,
        fkId: companyId,
      }),
      checkFk<Client>({
        service: this.clientService,
        fkId: clientId,
      }),
      checkDtos<Bill, CreateBillDto>({
        service: this.billService,
        dtos: billsDto,
      }),
      checkDtos<Cash, CreateCashDto>({
        service: this.cashService,
        dtos: cashDto,
      }),
      checkDtos<Check, CreateCheckDto>({
        service: this.checkService,
        dtos: checksDto,
      }),
      checkDtos<CreditNote, CreateCreditNoteDto>({
        service: this.creditNoteService,
        dtos: creditNotesDto,
      }),
      checkDtos<Credit, CreateCreditDto>({
        service: this.creditService,
        dtos: creditsDto,
      }),
      checkDtos<Deposit, CreateDepositDto>({
        service: this.depositService,
        dtos: depositsDto,
      }),
      checkDtos<Retention, CreateRetentionDto>({
        service: this.retentionService,
        dtos: retentionsDto,
      }),
    ]);
    return this.transactionRepository.create({
      ...rest,
      company,
      client,
      bills,
      cash,
      checks,
      credit_notes: creditNotes,
      credits,
      deposits,
      retentions,
    });
  }

  private handleInitialStatus(transaction: Transaction) {
    let numberOfItemsWithOkStatus = 0;
    const map = [
      {
        items: transaction.bills,
        status: 'bill_status',
      },
      {
        items: transaction.cash,
        status: 'cash_status',
      },
      {
        items: transaction.checks,
        status: 'check_status',
      },
      {
        items: transaction.credit_notes,
        status: 'credit_note_status',
      },
      {
        items: transaction.credits,
        status: 'credit_status',
      },
      {
        items: transaction.deposits,
        status: 'deposit_status',
      },
      {
        items: transaction.retentions,
        status: 'retention_status',
      },
    ];
    for (const { items, status } of map) {
      if (!items?.length) {
        transaction[status] = TRANSACTION_STATUS_ENUM.OK;
        numberOfItemsWithOkStatus++;
      }
    }
    if (numberOfItemsWithOkStatus === map.length) {
      transaction.status = TRANSACTION_STATUS_ENUM.OK;
    }
  }
}
