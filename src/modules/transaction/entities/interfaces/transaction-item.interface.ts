import { History } from 'src/modules/history/entities/history.entity';
import { TRANSACTION_STATUS_ENUM } from '../enum/transaction-status-.enum';
import { Transaction } from '../transaction.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { File } from 'src/storage-service/entities/file.entity';

export interface IItemTransaction {
  status: TRANSACTION_STATUS_ENUM;
  transaction: Transaction;
  historical: History[];
  approving_treasurer: User;
  setDataBeforeUpdateOnHistorical(): void;
  //comentario de solicitud de cambio
  request_change_comment: string;
}
export interface IItemTransactionWithFile extends IItemTransaction {
  file: File;
}
