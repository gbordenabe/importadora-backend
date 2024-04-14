import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
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
import {
  IItemTransaction,
  IItemTransactionWithFile,
} from '../entities/interfaces/transaction-item.interface';
import { LogFields } from 'src/common/entities/log-fields';
import { StorageService } from 'src/storage-service/storage.service';
import { saveTransactionFiles } from '../helpers/save-transaction-files.helper';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { S3 } from 'aws-sdk';
import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import * as archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { pipeline, Readable } from 'stream';
import { History } from 'src/modules/history/entities/history.entity';
import { GetPaymentType } from '../helpers/verify-type';
import { IHistoryResponse } from '../entities/interfaces/history-transaction.interface';
import { createObjectCsvStringifier } from 'csv-writer';
import { HeadersCsv } from '../entities/enum/headers-csv.enum';

const streamPipeline = promisify(pipeline);
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
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    private readonly companyService: CompanyService,
    private readonly billService: BillService,
    private readonly checkService: CheckService,
    private readonly cashService: CashService,
    private readonly depositService: DepositService,
    private readonly creditService: CreditService,
    private readonly retentionService: RetentionService,
    private readonly creditNoteService: CreditNoteService,
    private readonly clientService: ClientService,
    private readonly storageService: StorageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async rawSave(transaction: Transaction) {
    await this.transactionRepository.save(transaction);
  }

  async findAll({
    filters,
    requestUser,
    page = 1,
    limit = 10,
  }: {
    filters: Partial<FindAllTransactionsAsTreasureDto>;
    requestUser?: User;
    page: number;
    limit: number;
  }): Promise<{
    data: Transaction[];
    count: number;
    totalPages: number;
  }> /*Promise<IFindAndCountResult<Transaction>>*/ {
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
      total_amount_min,
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
    if (total_amount_min) {
      const subQuery =
        this.transactionRepository.createQueryBuilder('transaction');
      subQuery.select('transaction.id');

      subQuery.leftJoin('transaction.bills', 'bills');

      subQuery.groupBy('transaction.id');
      subQuery.having(`SUM(bills.amount) >= :total_amount_min`, {
        total_amount_min,
      });
      queryBuilder.andWhere(`transaction.id IN (${subQuery.getQuery()})`);
      queryBuilder.setParameters(subQuery.getParameters());
    }
    if (filters.total_amount !== undefined) {
      queryBuilder.andWhere('transaction.total_amount = :total_amount', {
        total_amount: filters.total_amount,
      });
    }
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

    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    const [data, count] = await queryBuilder.getManyAndCount();

    const newData = data.map((d) => {
      let status: TRANSACTION_STATUS_ENUM;
      const statusOrder = [
        TRANSACTION_STATUS_ENUM.TO_CHANGE,
        TRANSACTION_STATUS_ENUM.EDITED,
        TRANSACTION_STATUS_ENUM.PENDING,
        TRANSACTION_STATUS_ENUM.OK,
      ];

      for (let i = 0; i < statusOrder.length; i++) {
        if (d.check_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.cash_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.credit_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.credit_note_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.deposit_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.retention_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.credit_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
        if (d.bill_status == statusOrder[i]) {
          status = statusOrder[i];
          break;
        }
      }
      return {
        ...d,
        status: status,
      };
    });

    const totalPages = Math.ceil(count / limit);

    return { data: newData, count, totalPages };
  }

  async exportCsv({
    filters,
    page = 1,
    limit = 20,
  }: {
    filters: Partial<FindAllTransactionsAsTreasureDto>;
    page: number;
    limit: number;
  }) {
    const transactions = await this.findAll({
      filters,
      page,
      limit,
    });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: HeadersCsv.GENERAL_STATUS, title: 'Status General' },
        { id: HeadersCsv.SKU, title: 'SKU' },
        { id: HeadersCsv.FECHA, title: 'Fecha' },
        { id: HeadersCsv.VENDEDOR, title: 'Vendedor' },
        { id: HeadersCsv.EMPRESA, title: 'Empresa' },
        { id: HeadersCsv.CLIENTE, title: 'Cliente' },
        { id: HeadersCsv.MONTO, title: 'Monto' },
        { id: HeadersCsv.TOTAL_CHEQUES, title: 'Total Cheques' },
        { id: HeadersCsv.TOTAL_CHEQUES_SUB_ESTADO, title: 'Sub Estado' },
        { id: HeadersCsv.TOTAL_EFECTIVO, title: 'Total Efectivo' },
        { id: HeadersCsv.TOTAL_EFECTIVO_SUB_ESTADO, title: 'Sub Estado' },
        { id: HeadersCsv.TOTAL_DEPO_TRANS, title: 'Total depo /Trans' },
        { id: HeadersCsv.TOTAL_DEPO_TRANS_SUB_ESTADO, title: 'Sub estado' },
      ],
    });

    const parseDate = (date: Date | null) => {
      if (!date) return '-';
      const dateObj = new Date(date);
      dateObj.setHours(dateObj.getHours() - 3); // Adjust to GMT-3
      const day =
        dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
      const month =
        dateObj.getMonth() < 9
          ? `0${dateObj.getMonth() + 1}`
          : dateObj.getMonth() + 1;
      return `${day}-${month}-${dateObj.getFullYear()}`;
    };

    const parseStatus = (status: TRANSACTION_STATUS_ENUM) => {
      const diccionaryStatus = {
        [TRANSACTION_STATUS_ENUM.OK]: 'APROBADO',
        [TRANSACTION_STATUS_ENUM.PENDING]: 'PENDIENTE',
        [TRANSACTION_STATUS_ENUM.TO_CHANGE]: 'A CAMBIAR',
        [TRANSACTION_STATUS_ENUM.EDITED]: 'EDITADO',
      };

      return status ? diccionaryStatus[status] : '-';
    };

    const data = transactions.data.map((transaction) => {
      return {
        [HeadersCsv.GENERAL_STATUS]: parseStatus(transaction.status) || '-',
        [HeadersCsv.SKU]: transaction.sku || '-',
        [HeadersCsv.FECHA]: parseDate(transaction.created_at) || '-',
        [HeadersCsv.VENDEDOR]: transaction.created_by.name || '-',
        [HeadersCsv.EMPRESA]: transaction.company.name || '-',
        [HeadersCsv.CLIENTE]: transaction.client.name || '-',
        [HeadersCsv.MONTO]: transaction.total_amount || '-',
        [HeadersCsv.TOTAL_CHEQUES]: transaction.total_checks || '-',
        [HeadersCsv.TOTAL_CHEQUES_SUB_ESTADO]:
          parseStatus(transaction.check_status) || '-',
        [HeadersCsv.TOTAL_EFECTIVO]: transaction.total_cash || '-',
        [HeadersCsv.TOTAL_EFECTIVO_SUB_ESTADO]:
          parseStatus(transaction.cash_status) || '-',
        [HeadersCsv.TOTAL_DEPO_TRANS]: transaction.total_deposit || '-',
        [HeadersCsv.TOTAL_DEPO_TRANS_SUB_ESTADO]:
          parseStatus(transaction.deposit_status) || '-',
      };
    });

    const header = csvStringifier.getHeaderString();
    const records = csvStringifier.stringifyRecords(data);

    const stream = new Readable();

    stream.push(header);
    stream.push(records);
    stream.push(null);

    return stream;
  }

  entityName: string = Transaction.name;
  private readonly itemTransactionRelations: FindOptionsRelations<
    IItemTransaction & LogFields
  > = {
    approving_treasurer: userRelations,
    created_by: userRelations,
    updated_by: userRelations,
    historical: true,
  };
  private readonly itemTransactionWithFileRelations: FindOptionsRelations<
    IItemTransactionWithFile & LogFields
  > = {
    ...this.itemTransactionRelations,
    file: true,
  };
  relations: FindOptionsRelations<Transaction> = {
    company: true,
    client: true,
    created_by: userRelations,
    updated_by: userRelations,
    bills: this.itemTransactionRelations,
    cash: this.itemTransactionWithFileRelations,
    checks: this.itemTransactionWithFileRelations,
    credit_notes: this.itemTransactionRelations,
    credits: this.itemTransactionRelations,
    deposits: this.itemTransactionWithFileRelations,
    retentions: this.itemTransactionWithFileRelations,
  };

  async getTransactionFiles(transactionId: number) {
    const s3 = new S3({
      region: 'sa-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const filesTransactions = await this.transactionRepository.find({
      where: { id: transactionId },
      relations: [
        'cash',
        'deposits',
        'checks',
        'retentions',
        'deposits.file',
        'cash.file',
        'checks.file',
        'retentions.file',
      ],
    });

    const filesNamesTransactions = filesTransactions
      .map((t) => [
        ...t.cash?.map((c) => c.file.file_name),
        ...t.deposits?.map((d) => d.file.file_name),
        ...t.checks?.map((c) => c.file.file_name),
        ...t.retentions?.map((r) => r.file.file_name),
      ])
      .flat();

    const zipFileName = `transaction_${transactionId}_${uuidv4()}.zip`;
    const output = createWriteStream(zipFileName);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const fileName of filesNamesTransactions) {
      const fileStream = s3
        .getObject({
          Bucket: 'importadora-prod',
          Key: fileName,
        })
        .createReadStream();

      archive.append(fileStream, { name: fileName });
    }

    await archive.finalize();

    const uploadedZip = await s3
      .upload({
        Bucket: 'importadora-prod',
        Key: `zips/${zipFileName}`,
        Body: createReadStream(zipFileName),
      })
      .promise();

    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: 'importadora-prod',
      Key: `zips/${zipFileName}`,
      Expires: 60 * 5,
    });

    unlinkSync(zipFileName);

    return signedUrl;
  }

  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
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

  @OnEvent('transaction.created')
  handleTransactionCreatedEvent(transaction: Transaction) {
    saveTransactionFiles(transaction, this.storageService);
  }
  async create(
    dto: CreateTransactionDto,
    files: Express.Multer.File[],
    requestUser: User,
  ): Promise<Transaction> {
    const dtoVerified = await this.getAndVerifyDto(dto, files);
    this.setTransactionLogsBeforeToSave(dtoVerified, requestUser);
    this.handleInitialStatus(dtoVerified);
    try {
      const billsTotalAmount =
        dto?.bills?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const cashsTotalAmount =
        dto?.cash?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const checksTotalAmount =
        dto?.checks?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const depositsTotalAmount =
        dto?.deposits?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const creditsTotalAmount =
        dto?.credits?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const creditsNotesTotalAmount =
        dto?.credit_notes?.reduce((acc, bill) => acc + bill.amount, 0) || null;
      const retentionsTotalAmount =
        dto?.retentions?.reduce((acc, bill) => acc + bill.amount, 0) || null;

      const grandTotal =
        (cashsTotalAmount ?? 0) +
        (checksTotalAmount ?? 0) +
        (depositsTotalAmount ?? 0) +
        (creditsTotalAmount ?? 0) +
        (creditsNotesTotalAmount ?? 0) +
        (retentionsTotalAmount ?? 0);

      const transaction = await this.transactionRepository.save({
        total_bill: billsTotalAmount,
        total_cash: cashsTotalAmount,
        total_checks: checksTotalAmount,
        total_deposit: depositsTotalAmount,
        total_credit: creditsTotalAmount,
        total_credit_note: creditsNotesTotalAmount,
        total_retention: retentionsTotalAmount,
        total_amount: grandTotal,
        ...dtoVerified,
      });
      this.eventEmitter.emit('transaction.created', dtoVerified);

      console.log('transaction', transaction);

      const paymentType = GetPaymentType(transaction);

      const history = new History();
      history.transaction = transaction;
      history.payment_type = paymentType;
      history.statuses = TRANSACTION_STATUS_ENUM.PENDING;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

      return transaction;
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
    files: Express.Multer.File[] = [],
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
      credit_notes,
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
        args: [files],
      }),
      checkDtos<Check, CreateCheckDto>({
        service: this.checkService,
        dtos: checksDto,
        args: [files],
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
        args: [files],
      }),
      checkDtos<Retention, CreateRetentionDto>({
        service: this.retentionService,
        dtos: retentionsDto,
        args: [files],
      }),
    ]);
    const transaction = this.transactionRepository.create({
      ...rest,
      company,
      client,
    });
    transaction.bills = bills;
    transaction.cash = cash;
    transaction.checks = checks;
    transaction.credit_notes = credit_notes;
    transaction.credits = credits;
    transaction.deposits = deposits;
    transaction.retentions = retentions;
    return transaction;
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

  async historysTransactions(id: number): Promise<IHistoryResponse[]> {
    const history = await this.historyRepository.find({
      where: { transaction: { id: id } },
      relations: ['created_by', 'created_by.role'],
      order: { created_at: 'DESC' },
    });
    return history.map((history) => ({
      id: history.id,
      statuses: history.statuses,
      payment_type: history.payment_type,
      created_at: history.created_at,
      data: history.data,
      created_by: {
        name: history.created_by.name,
        last_name: history.created_by.last_name,
        role: {
          name: history.created_by.role.name,
        },
      },
    }));
  }
}
