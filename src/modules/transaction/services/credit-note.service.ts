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
import { CreditNote } from '../entities/credit-note.entity';
import { CreateCreditNoteDto } from '../dtos/create/create-credit-note.dto';
import { UpdateCreditNoteDto } from '../dtos/update/update-credit-note.dto';
import { History } from 'src/modules/history/entities/history.entity';

@Injectable()
export class CreditNoteService
  implements
    Omit<
      IServiceInterface<CreditNote, CreateCreditNoteDto, UpdateCreditNoteDto>,
      'create' | 'removeOneById' | 'findAll'
    >
{
  constructor(
    @InjectRepository(CreditNote)
    private readonly creditNoteRepository: Repository<CreditNote>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}
  async findOneById(
    { id, relations = true }: IFindOneByIdOptions,
    requestUser?: User,
  ): Promise<CreditNote> {
    const creditNote = await this.creditNoteRepository.findOne({
      where: {
        id,
        created_by: getOptionalUser(requestUser),
      },
      relations: relations ? this.relations : [],
    });
    if (!creditNote) throw new NotFoundException('Credit Note not found');
    return creditNote;
  }
  async updateOneById(
    id: number,
    dto: UpdateCreditNoteDto,
    { requestUser, isAdministrator }: IUserLog,
  ): Promise<CreditNote> {
    const creditNote = await this.findOneById(
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
      const updatedCreditNote = await this.creditNoteRepository.save({
        ...creditNote,
        ...dtoVerified,
      });
      await handleAndSaveTransactionStatus(
        updatedCreditNote.transaction.id,
        this.transactionService,
      );

      const history = new History();
      history.transaction = updatedCreditNote.transaction;
      history.payment_type = 'credit_note';
      history.statuses = TRANSACTION_STATUS_ENUM.EDITED;
      history.created_by = requestUser;
      history.created_at = new Date();
      await this.historyRepository.save(history);

      return updatedCreditNote;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  entityName: string = CreditNote.name;
  relations: FindOptionsRelations<CreditNote> = {
    created_by: userRelations,
    updated_by: userRelations,
    transaction: true,
    historical: true,
  };
  async getAndVerifyDto(
    dto: Partial<CreateCreditNoteDto & UpdateCreditNoteDto> = {},
  ): Promise<CreditNote> {
    return this.creditNoteRepository.create(dto);
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
    history.payment_type = 'credit_note';
    history.statuses = status;
    history.created_by = requestUser;
    history.created_at = new Date();
    await this.historyRepository.save(history);

    await this.creditNoteRepository.save(item);
    await handleAndSaveTransactionStatus(
      item.transaction.id,
      this.transactionService,
    );
  }
}
