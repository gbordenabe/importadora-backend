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
import { Check } from '../entities/check.entity';
import { CreateCheckDto } from '../dtos/create/create-check.dto';
import { UpdateCheckDto } from '../dtos/update/update-check.dto';

@Injectable()
export class CheckService
  implements
    Omit<
      IServiceInterface<Check, CreateCheckDto, UpdateCheckDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Check)
    private readonly checkRepository: Repository<Check>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Check> {
    const check = await this.checkRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!check) throw new NotFoundException('Check not found');
    return check;
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
    await this.checkRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
  async updateOneById(
    id: number,
    dto: UpdateCheckDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<Check> {
    const check = await this.findOneById(
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
      const updatedCheck = await this.checkRepository.save({
        ...check,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedCheck.transaction.id,
        this.transactionService,
      );
      return updatedCheck;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Check.name;
  relations: FindOptionsRelations<Check> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateCheckDto & UpdateCheckDto> = {},
  ): Promise<Check> {
    return this.checkRepository.create(dto);
  }
}
