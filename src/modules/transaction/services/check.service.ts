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
import { handleAndSetterFileEntityOnTransactionItem } from '../helpers/set-file-entity-on-transaction-item.helper';
import { getFileEntity } from 'src/storage-service/utils/get-file-entity.util';
import { StorageService } from 'src/storage-service/storage.service';
import { History } from 'src/modules/history/entities/history.entity';

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
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly storageService: StorageService,
  ) {}
  async getFileByCheckId(
    id: number,
    { requestUser, isAdministrator }: IUserLog,
  ) {
    const check = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!check.file) throw new NotFoundException('File not found');
    return await this.storageService.readBuffer(check.file.file_name);
  }
  async deleteFileByCheckId(
    id: number,
    { isAdministrator, requestUser }: IUserLog,
  ) {
    const check = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!check.file) throw new NotFoundException('File not found');
    await this.storageService.deleteFile(check.file.file_name);
    check.file = null;
    setLogs({
      entity: check,
      updatedBy: requestUser,
    });
    await this.checkRepository.save(check);
  }
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

    const history = new History();
    history.transaction = item.transaction;
    history.payment_type = 'check ' + item.type;
    history.statuses = status;
    history.created_by = requestUser;
    history.created_at = new Date();
    await this.historyRepository.save(history);

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
    file: Express.Multer.File,
  ): Promise<Check> {
    const check = await this.findOneById(
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
      const updatedCheck = await this.checkRepository.save({
        ...check,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedCheck.transaction.id,
        this.transactionService,
      );
      if (file)
        await this.storageService.replaceFile(
          {
            file,
            name: dtoVerified.file.file_name,
          },
          check.file?.file_name,
        );

      const history = new History();
      history.transaction = updatedCheck.transaction;
      history.payment_type = 'check ' + updatedCheck.type;
      history.statuses = TRANSACTION_STATUS_ENUM.EDITED;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

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
    file: true,
  };

  async getAndVerifyDto(
    dto: Partial<CreateCheckDto & UpdateCheckDto> = {},
    files: Express.Multer.File[] = [],
  ): Promise<Check> {
    const { file_field_name, ...rest } = dto;
    const check = this.checkRepository.create(rest);
    if (file_field_name) {
      handleAndSetterFileEntityOnTransactionItem({
        entity: check,
        fieldName: file_field_name,
        files,
        isMandatory: false,
      });
    }
    return check;
  }
}
