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
import { Cash } from '../entities/cash.entity';
import { CreateCashDto } from '../dtos/create/create-cash.dto';
import { UpdateCashDto } from '../dtos/update/update-cash.dto';
import { getFileEntity } from 'src/storage-service/utils/get-file-entity.util';
import { StorageService } from 'src/storage-service/storage.service';
import { handleAndSetterFileEntityOnTransactionItem } from '../helpers/set-file-entity-on-transaction-item.helper';

@Injectable()
export class CashService
  implements
    Omit<
      IServiceInterface<Cash, CreateCashDto, UpdateCashDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly storageService: StorageService,
  ) {}

  async getFileByCashId(
    id: number,
    { requestUser, isAdministrator }: IUserLog,
  ) {
    const cash = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!cash.file) throw new NotFoundException('File not found');
    return await this.storageService.readBuffer(cash.file.file_name);
  }
  async deleteFileByCashId(
    id: number,
    { isAdministrator, requestUser }: IUserLog,
  ) {
    const cash = await this.findOneById(
      { id },
      isAdministrator ? null : requestUser,
    );
    if (!cash.file) throw new NotFoundException('File not found');
    await this.storageService.deleteFile(cash.file.file_name);
    cash.file = null;
    setLogs({
      entity: cash,
      updatedBy: requestUser,
    });
    await this.cashRepository.save(cash);
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
    await this.cashRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<Cash> {
    const cash = await this.cashRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!cash) throw new NotFoundException('Cash not found');
    return cash;
  }
  async updateOneById(
    id: number,
    dto: UpdateCashDto,
    { requestUser, isAdministrator }: IUserLog,
    file: Express.Multer.File,
  ): Promise<Cash> {
    const cash = await this.findOneById(
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
      const updatedCash = await this.cashRepository.save({
        ...cash,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedCash.transaction.id,
        this.transactionService,
      );
      if (file)
        await this.storageService.replaceFile(
          {
            file,
            name: dtoVerified.file.file_name,
          },
          cash.file?.file_name,
        );
      return updatedCash;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = Cash.name;
  relations: FindOptionsRelations<Cash> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
    file: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateCashDto & UpdateCashDto> = {},
    files: Express.Multer.File[] = [],
  ): Promise<Cash> {
    const { file_field_name, ...rest } = dto;
    const cash = this.cashRepository.create(rest);
    if (file_field_name) {
      handleAndSetterFileEntityOnTransactionItem({
        entity: cash,
        fieldName: file_field_name,
        files,
        isMandatory: false,
      });
    }
    return cash;
  }
}
