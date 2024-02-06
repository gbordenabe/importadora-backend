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
import { Credit } from '../entities/credit.entity';
import { CreateCreditDto } from '../dtos/create/create-credit.dto';
import { UpdateCreditDto } from '../dtos/update/update-credit.dto';

@Injectable()
export class CreditService
  implements
    Omit<
      IServiceInterface<Credit, CreateCreditDto, UpdateCreditDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Credit> {
    const credit = await this.creditRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!credit) throw new NotFoundException('Credit not found');
    return credit;
  }
  async updateOneById(
    id: number,
    dto: UpdateCreditDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<Credit> {
    const credit = await this.findOneById(
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
      const updatedCredit = await this.creditRepository.save({
        ...credit,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedCredit.transaction.id,
        this.transactionService,
      );
      return updatedCredit;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Credit.name;
  relations: FindOptionsRelations<Credit> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateCreditDto & UpdateCreditDto> = {},
  ): Promise<Credit> {
    return this.creditRepository.create(dto);
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
    await this.creditRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
