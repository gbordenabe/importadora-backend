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
import { Retention } from '../entities/retention.entity';
import { CreateRetentionDto } from '../dtos/create/create-retention.dto';
import { UpdateRetentionDto } from '../dtos/update/update-retention.dto';

@Injectable()
export class RetentionService
  implements
    Omit<
      IServiceInterface<Retention, CreateRetentionDto, UpdateRetentionDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Retention)
    private readonly retentionRepository: Repository<Retention>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Retention> {
    const retention = await this.retentionRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!retention) throw new NotFoundException('Retention not found');
    return retention;
  }
  async updateOneById(
    id: number,
    dto: UpdateRetentionDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<Retention> {
    const retention = await this.findOneById(
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
      const updatedRetention = await this.retentionRepository.save({
        ...retention,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedRetention.transaction.id,
        this.transactionService,
      );
      return updatedRetention;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Retention.name;
  relations: FindOptionsRelations<Retention> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateRetentionDto & UpdateRetentionDto> = {},
  ): Promise<Retention> {
    return this.retentionRepository.create(dto);
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
    await this.retentionRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
