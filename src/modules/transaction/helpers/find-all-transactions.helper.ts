import { SelectQueryBuilder } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { ORDER_ENUM } from 'src/common/enum/order.enum.';
import { TRANSACTION_ORDER_BY_ENUM } from '../dtos/enum/transaction-order-by.enum';
import { getRandomIntegerId } from 'src/common/utilities/random-integer-id.helper';

export const setRelationsOnQueryBuilder = (
  queryBuilder: SelectQueryBuilder<Transaction>,
) => {
  queryBuilder.leftJoinAndSelect('transaction.company', 'company');
  queryBuilder.leftJoinAndSelect('transaction.client', 'client');

  //bill
  queryBuilder.leftJoinAndSelect('transaction.bills', 'bills');
  queryBuilder.leftJoinAndSelect('bills.created_by', 'bills_created_by');
  queryBuilder.leftJoinAndSelect('bills.updated_by', 'bills_updated_by');
  //check
  queryBuilder.leftJoinAndSelect('transaction.checks', 'checks');
  queryBuilder.leftJoinAndSelect('checks.created_by', 'checks_created_by');
  queryBuilder.leftJoinAndSelect('checks.updated_by', 'checks_updated_by');
  queryBuilder.leftJoinAndSelect('checks.file', 'checks_file');
  //deposit
  queryBuilder.leftJoinAndSelect('transaction.deposits', 'deposits');
  queryBuilder.leftJoinAndSelect('deposits.created_by', 'deposits_created_by');
  queryBuilder.leftJoinAndSelect('deposits.updated_by', 'deposits_updated_by');
  queryBuilder.leftJoinAndSelect('deposits.file', 'deposits_file');
  //cash
  queryBuilder.leftJoinAndSelect('transaction.cash', 'cash');
  queryBuilder.leftJoinAndSelect('cash.created_by', 'cash_created_by');
  queryBuilder.leftJoinAndSelect('cash.updated_by', 'cash_updated_by');
  queryBuilder.leftJoinAndSelect('cash.file', 'cash_file');
  //credit
  queryBuilder.leftJoinAndSelect('transaction.credits', 'credits');
  queryBuilder.leftJoinAndSelect('credits.created_by', 'credits_created_by');
  queryBuilder.leftJoinAndSelect('credits.updated_by', 'credits_updated_by');
  //credit_note
  queryBuilder.leftJoinAndSelect('transaction.credit_notes', 'credit_notes');
  queryBuilder.leftJoinAndSelect(
    'credit_notes.created_by',
    'credit_notes_created_by',
  );
  queryBuilder.leftJoinAndSelect(
    'credit_notes.updated_by',
    'credit_notes_updated_by',
  );
  //retention
  queryBuilder.leftJoinAndSelect('transaction.retentions', 'retentions');
  queryBuilder.leftJoinAndSelect(
    'retentions.created_by',
    'retentions_created_by',
  );
  queryBuilder.leftJoinAndSelect(
    'retentions.updated_by',
    'retentions_updated_by',
  );
  queryBuilder.leftJoinAndSelect('retentions.file', 'retentions_file');
  //user logs
  queryBuilder.leftJoinAndSelect('transaction.created_by', 'created_by');
  queryBuilder.leftJoinAndSelect('transaction.updated_by', 'updated_by');
};
export interface ISetOrderOnQueryBuilderOptions {
  order: ORDER_ENUM;
  orderBy: TRANSACTION_ORDER_BY_ENUM;
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export interface ISetFieldInQueryBuilderOptions {
  field: string;
  values: (string | number)[];
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export interface ISetWhereEqualInQueryBuilderOptions {
  field: string;
  value: string | number | Date | boolean;
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export interface ISetDateRangeInQueryBuilderOptions {
  field: string;
  start?: Date | string;
  end?: Date | string;
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export interface ISetRangeInQueryBuilderOptions {
  field: string;
  start?: number;
  end?: number;
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export interface ISetDateRangeInQueryBuilderOptions {
  field: string;
  start?: Date | string;
  end?: Date | string;
  queryBuilder: SelectQueryBuilder<Transaction>;
}
export const setOrderOnQueryBuilder = ({
  order,
  orderBy,
  queryBuilder,
}: ISetOrderOnQueryBuilderOptions) => {
  const orderByMap = {
    [TRANSACTION_ORDER_BY_ENUM.ID]: 'transaction.id',
    [TRANSACTION_ORDER_BY_ENUM.CLIENT_NAME]: 'client.name',
    [TRANSACTION_ORDER_BY_ENUM.COMPANY_NAME]: 'company.name',
    [TRANSACTION_ORDER_BY_ENUM.SKU]: 'transaction.sku',
    [TRANSACTION_ORDER_BY_ENUM.CLIENT_NUMBER]:
      'CAST(client.client_number AS UNSIGNED)',
  };
  queryBuilder.orderBy(orderByMap[orderBy], order);
};
export const setFieldInQueryBuilder = ({
  field,
  values,
  queryBuilder,
}: ISetFieldInQueryBuilderOptions) => {
  if (!values?.length) return;
  const paramName = field.concat(getRandomIntegerId().toString());
  values = Array.from(new Set<string | number>(values));
  queryBuilder.andWhere(`${field} IN (:...${paramName})`, {
    [paramName]: values,
  });
};
export const setWhereEqualInQueryBuilder = ({
  field,
  value,
  queryBuilder,
}: ISetWhereEqualInQueryBuilderOptions) => {
  if (!value) return;
  const paramName = field.concat(getRandomIntegerId().toString());
  queryBuilder.andWhere(`${field} = :${paramName}`, {
    [paramName]: value,
  });
};

export const setRangeInQueryBuilder = ({
  field,
  start,
  end,
  queryBuilder,
}: ISetRangeInQueryBuilderOptions) => {
  if (start) {
    const paramName = field.concat(getRandomIntegerId().toString());
    queryBuilder.andWhere(`${field} >= :${paramName}`, { [paramName]: start });
  }
  if (end) {
    const paramName = field.concat(getRandomIntegerId().toString());
    queryBuilder.andWhere(`${field} <= :${paramName}`, { [paramName]: end });
  }
};
export const setDateRangeInQueryBuilder = ({
  field,
  start,
  end,
  queryBuilder,
}: ISetDateRangeInQueryBuilderOptions) => {
  if (start) {
    const paramName = field.concat(getRandomIntegerId().toString());
    queryBuilder.andWhere(`${field} >= :${paramName}`, {
      [paramName]: new Date(start),
    });
  }
  if (end) {
    const paramName = field.concat(getRandomIntegerId().toString());
    queryBuilder.andWhere(`${field} <= :${paramName}`, {
      [paramName]: new Date(end),
    });
  }
};
