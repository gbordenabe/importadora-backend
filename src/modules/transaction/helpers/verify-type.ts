import { Transaction } from '../entities/transaction.entity';

export function GetPaymentType(transaction: Transaction): string {
  const types = [];
  const checkTypes = new Set<string>();

  if (transaction.bills?.length > 0 && transaction.bill_status === 'PENDING') {
    types.push('bill');
  }
  if (transaction.cash?.length > 0 && transaction.cash_status === 'PENDING') {
    types.push('cash');
  }
  if (
    transaction.deposits?.length > 0 &&
    transaction.deposit_status === 'PENDING'
  ) {
    types.push('deposit');
  }
  transaction.checks?.forEach((check) => {
    if (check.status === 'PENDING') {
      checkTypes.add(check.type);
    }
  });

  if (checkTypes.size > 0) {
    const checksString = Array.from(checkTypes).join(', ');
    types.push(`check (${checksString})`);
  }
  if (
    transaction.credit_notes?.length > 0 &&
    transaction.credit_note_status === 'PENDING'
  ) {
    types.push('credit_note');
  }
  if (
    transaction.credits?.length > 0 &&
    transaction.credit_status === 'PENDING'
  ) {
    types.push('credit');
  }
  if (
    transaction.retentions?.length > 0 &&
    transaction.retention_status === 'PENDING'
  ) {
    types.push('retention');
  }

  return types.join(', '); // Esto devolverá una cadena como "bill, cash, deposit"
}
