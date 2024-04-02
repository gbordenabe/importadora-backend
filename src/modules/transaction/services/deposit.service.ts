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
import { getFileEntity } from 'src/storage-service/utils/get-file-entity.util';
import { StorageService } from 'src/storage-service/storage.service';
import { handleAndSetterFileEntityOnTransactionItem } from '../helpers/set-file-entity-on-transaction-item.helper';
import { History } from 'src/modules/history/entities/history.entity';

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
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly storageService: StorageService,
  ) {}

  async getFileByDepositId(
    id: number,
    { requestUser, isAdministrator }: IUserLog,
  ) {
    const deposit = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!deposit.file) throw new NotFoundException('File not found');
    return await this.storageService.readBuffer(deposit.file.file_name);
  }
  async deleteFileByDepositId(
    id: number,
    { isAdministrator, requestUser }: IUserLog,
  ) {
    const deposit = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!deposit.file) throw new NotFoundException('File not found');
    await this.storageService.deleteFile(deposit.file.file_name);
    deposit.file = null;
    setLogs({
      entity: deposit,
      updatedBy: requestUser,
    });
    await this.depositRepository.save(deposit);
  }

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
    file: Express.Multer.File,
  ): Promise<Deposit> {
    const deposit = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    const dtoVerified = await this.getAndVerifyDto(dto);
    if (file) dtoVerified.file = getFileEntity(file);
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
      if (file)
        await this.storageService.replaceFile(
          {
            file,
            name: dtoVerified.file.file_name,
          },
          deposit.file?.file_name,
        );

      const history = new History();
      history.transaction = updatedDeposit.transaction;
      history.payment_type = 'deposit';
      history.statuses = TRANSACTION_STATUS_ENUM.EDITED;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

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
    file: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateDepositDto & UpdateDepositDto> = {},
    files: Express.Multer.File[] = [],
  ): Promise<Deposit> {
    const { file_field_name, ...rest } = dto;
    const deposit = this.depositRepository.create(rest);
    if (file_field_name) {
      handleAndSetterFileEntityOnTransactionItem({
        entity: deposit,
        fieldName: file_field_name,
        files,
        isMandatory: true,
      });
    }
    return deposit;
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

    const history = new History();
    history.transaction = item.transaction;
    history.payment_type = 'deposit';
    history.statuses = status;
    history.created_by = requestUser;
    history.created_at = new Date();
    await this.historyRepository.save(history);

    await this.depositRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
