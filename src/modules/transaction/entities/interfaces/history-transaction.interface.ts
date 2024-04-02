import { TRANSACTION_STATUS_ENUM } from '../enum/transaction-status-.enum';

export interface IHistoryResponse {
  id: number;
  statuses: TRANSACTION_STATUS_ENUM;
  payment_type: string;
  created_at: Date;
  data: any;
  created_by: {
    name: string;
    last_name: string;
    role: {
      name: string;
    };
  };
}
