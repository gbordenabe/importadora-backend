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
import { handleAndSetterFileEntityOnTransactionItem } from '../helpers/set-file-entity-on-transaction-item.helper';
import { getFileEntity } from 'src/storage-service/utils/get-file-entity.util';
import { StorageService } from 'src/storage-service/storage.service';
import { History } from 'src/modules/history/entities/history.entity';

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
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly storageService: StorageService,
  ) {}

  async getFileByRetentionId(
    id: number,
    { requestUser, isAdministrator }: IUserLog,
  ) {
    const retention = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!retention.file) throw new NotFoundException('File not found');
    return await this.storageService.readBuffer(retention.file.file_name);
  }
  async deleteFileByRetentionId(
    id: number,
    { isAdministrator, requestUser }: IUserLog,
  ) {
    const retention = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!retention.file) throw new NotFoundException('File not found');
    await this.storageService.deleteFile(retention.file.file_name);
    retention.file = null;
    setLogs({
      entity: retention,
      updatedBy: requestUser,
    });
    await this.retentionRepository.save(retention);
  }

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
    file: Express.Multer.File,
  ): Promise<Retention> {
    const retention = await this.findOneById(
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
      const updatedRetention = await this.retentionRepository.save({
        ...retention,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedRetention.transaction.id,
        this.transactionService,
      );
      if (file)
        await this.storageService.replaceFile(
          {
            file,
            name: dtoVerified.file.file_name,
          },
          retention.file?.file_name,
        );

      const history = new History();
      history.transaction = updatedRetention.transaction;
      history.payment_type = 'retention';
      history.statuses = TRANSACTION_STATUS_ENUM.EDITED;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

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
    file: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateRetentionDto & UpdateRetentionDto> = {},
    files: Express.Multer.File[] = [],
  ): Promise<Retention> {
    const { file_field_name, ...rest } = dto;
    const retention = this.retentionRepository.create(rest);
    if (file_field_name) {
      handleAndSetterFileEntityOnTransactionItem({
        entity: retention,
        fieldName: file_field_name,
        files,
        isMandatory: true,
      });
    }
    return retention;
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
    history.payment_type = 'retention';
    history.statuses = status;
    history.created_by = requestUser;
    history.created_at = new Date();
    await this.historyRepository.save(history);

    await this.retentionRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
