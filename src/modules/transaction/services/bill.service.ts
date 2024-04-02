import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from '../entities/bill.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';
import { CreateBillDto } from '../dtos/create/create-bill.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { setLogs } from 'src/common/helpers/set-logs.helper';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { getOptionalUser } from 'src/common/helpers/get-optional-user.helper';
import { TransactionService } from './transaction.service';
import {
  handleAndSaveTransactionStatus,
  handleItemTransactionStatus,
} from '../helpers/handle-transaction-status.helper';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { userRelations } from 'src/modules/user/user.service';
import { IUserLog } from 'src/common/interfaces/user-log.interface';
import { UpdateBillDto } from '../dtos/update/update-bill.dto';
import { History } from 'src/modules/history/entities/history.entity';

@Injectable()
export class BillService
  implements
    Omit<
      IServiceInterface<Bill, CreateBillDto, UpdateBillDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    return bill;
  }

  async setStatus(
    id: number,
    status: TRANSACTION_STATUS_ENUM,
    requestUser: User,
    comment?: string,
  ) {
    const item = await this.findOneById({ id });
    handleItemTransactionStatus({
      itemTransaction: item,
      status,
      requestUser,
    });
    if (comment) {
      item.request_change_comment = comment;
    }
    await this.billRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );

    const history = new History();
    history.transaction = item.transaction;
    history.payment_type = 'bill';
    history.statuses = status;
    history.created_by = requestUser;
    history.created_at = new Date();
    await this.historyRepository.save(history);
  }
  async updateOneById(
    id: number,
    dto: UpdateBillDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<Bill> {
    const bill = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    const dtoVerified = await this.getAndVerifyDto(dto);
    setLogs({
      entity: dtoVerified,
      updatedBy: requestUser,
    });
    handleItemTransactionStatus({
      itemTransaction: dtoVerified,
      status: TRANSACTION_STATUS_ENUM.EDITED,
      requestUser,
    });
    try {
      const updatedBill = await this.billRepository.save({
        ...bill,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedBill.transaction.id,
        this.transactionService,
      );

      const history = new History();
      history.transaction = updatedBill.transaction;
      history.payment_type = 'bill';
      history.statuses = TRANSACTION_STATUS_ENUM.EDITED;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

      return updatedBill;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Bill.name;
  relations: FindOptionsRelations<Bill> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateBillDto & UpdateBillDto> = {},
  ): Promise<Bill> {
    return this.billRepository.create(dto);
  }
}
