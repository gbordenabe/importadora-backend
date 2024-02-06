import { User } from 'src/modules/user/entities/user.entity';
import { TRANSACTION_STATUS_ENUM } from '../entities/enum/transaction-status-.enum';
import { IItemTransaction } from '../entities/interfaces/transaction-item.interface';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';
import { ForbiddenException } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from '../services/transaction.service';
import { LogFields } from 'src/common/entities/log-fields';
export interface IHandleTransactionStatus {
  itemTransaction: IItemTransaction & LogFields;
  status: TRANSACTION_STATUS_ENUM;
  requestUser?: User;
}
const isThereAnyOfThisStatus = (
  status: TRANSACTION_STATUS_ENUM,
  itemTransactions: IItemTransaction[],
) => {
  return itemTransactions.some(
    (itemTransaction) => itemTransaction.status === status,
  );
};
const handleAndGetterTransactionItemsStatus = (
  items: IItemTransaction[] = [],
) => {
  const isThereAnyItemToChange = isThereAnyOfThisStatus(
    TRANSACTION_STATUS_ENUM.TO_CHANGE,
    items,
  );
  const isThereAnyItemEdited = isThereAnyOfThisStatus(
    TRANSACTION_STATUS_ENUM.EDITED,
    items,
  );
  const isThereAnyItemPending = isThereAnyOfThisStatus(
    TRANSACTION_STATUS_ENUM.PENDING,
    items,
  );
  if (isThereAnyItemToChange) return TRANSACTION_STATUS_ENUM.TO_CHANGE;
  if (isThereAnyItemEdited) return TRANSACTION_STATUS_ENUM.EDITED;
  if (isThereAnyItemPending) return TRANSACTION_STATUS_ENUM.PENDING;
  return TRANSACTION_STATUS_ENUM.OK;
};

export const handleTransactionStatus = (transaction: Transaction) => {
  const bill_status = handleAndGetterTransactionItemsStatus(transaction.bills);
  const cash_status = handleAndGetterTransactionItemsStatus(transaction.cash);
  const check_status = handleAndGetterTransactionItemsStatus(
    transaction.checks,
  );
  const credit_note_status = handleAndGetterTransactionItemsStatus(
    transaction.credit_notes,
  );
  const credit_status = handleAndGetterTransactionItemsStatus(
    transaction.credits,
  );
  const deposit_status = handleAndGetterTransactionItemsStatus(
    transaction.deposits,
  );
  const retention_status = handleAndGetterTransactionItemsStatus(
    transaction.retentions,
  );
  transaction.bill_status = bill_status;
  transaction.cash_status = cash_status;
  transaction.check_status = check_status;
  transaction.credit_note_status = credit_note_status;
  transaction.credit_status = credit_status;
  transaction.deposit_status = deposit_status;
  transaction.retention_status = retention_status;
  const allItemsStatus = [
    bill_status,
    cash_status,
    check_status,
    credit_note_status,
    credit_status,
    deposit_status,
    retention_status,
  ];
  if (allItemsStatus.includes(TRANSACTION_STATUS_ENUM.TO_CHANGE)) {
    transaction.status = TRANSACTION_STATUS_ENUM.TO_CHANGE;
  }
  if (allItemsStatus.includes(TRANSACTION_STATUS_ENUM.EDITED)) {
    transaction.status = TRANSACTION_STATUS_ENUM.EDITED;
  }
  if (allItemsStatus.includes(TRANSACTION_STATUS_ENUM.PENDING)) {
    transaction.status = TRANSACTION_STATUS_ENUM.PENDING;
  }
  if (allItemsStatus.every((status) => status === TRANSACTION_STATUS_ENUM.OK))
    transaction.status = TRANSACTION_STATUS_ENUM.OK;
};
/**
 * @param {User} requestUser: usuario que realiza la peticion, si no se envia se asume que es el tesorero
 */
export const handleItemTransactionStatus = ({
  itemTransaction,
  status,
  requestUser,
}: IHandleTransactionStatus) => {
  const canEditInAnyCase = Boolean(
    !requestUser || requestUser?.role?.name === ROLE_NAME_ENUM.TREASURER,
  );

  const statusThatAnyOneCanToSet = TRANSACTION_STATUS_ENUM.EDITED;
  if (!canEditInAnyCase && status !== statusThatAnyOneCanToSet)
    throw new ForbiddenException(
      'You are not allowed to change this transaction status',
    );
  itemTransaction.status = status;
  const statusesThatSetByTreasurer = [
    TRANSACTION_STATUS_ENUM.TO_CHANGE,
    TRANSACTION_STATUS_ENUM.OK,
  ];
  if (requestUser && statusesThatSetByTreasurer.includes(status)) {
    itemTransaction.approving_treasurer = requestUser;
  }
};
export const handleAndSaveTransactionStatus = async (
  transactionId: number,
  transactionService: TransactionService,
) => {
  const transaction = await transactionService.findOneById({
    id: transactionId,
  });
  handleTransactionStatus(transaction);
  await transactionService.rawSave(transaction);
};
