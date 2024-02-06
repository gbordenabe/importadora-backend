import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  IFindOneByIdOptions,
  IServiceInterface,
} from 'src/common/interfaces/service.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { setLogs } from 'src/common/helpers/set-logs.helper';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { userRelations } from 'src/modules/user/user.service';
import { getOptionalUser } from 'src/common/helpers/get-optional-user.helper';
import { TransactionService } from './transaction.service';
import {
  handleAndSaveTransactionStatus,
  handleItemTransactionStatus,
} from '../helpers/handle-transaction-status.helper';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { IUserLog } from 'src/common/interfaces/user-log.interface';
import { Deposit } from '../entities/deposit.entity';
import { CreateDepositDto } from '../dtos/create/create-deposit.dto';
import { UpdateDepositDto } from '../dtos/update/update-deposit.dto';

@Injectable()
export class DepositService
  implements
    Omit<
      IServiceInterface<Deposit, CreateDepositDto, UpdateDepositDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Deposit> {
    const deposit = await this.depositRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!deposit) throw new NotFoundException('Deposit not found');
    return deposit;
  }
  async updateOneById(
    id: number,
    dto: UpdateDepositDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<Deposit> {
    const deposit = await this.findOneById(
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
      const updatedDeposit = await this.depositRepository.save({
        ...deposit,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedDeposit.transaction.id,
        this.transactionService,
      );
      return updatedDeposit;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Deposit.name;
  relations: FindOptionsRelations<Deposit> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateDepositDto & UpdateDepositDto> = {},
  ): Promise<Deposit> {
    return this.depositRepository.create(dto);
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
    await this.depositRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
