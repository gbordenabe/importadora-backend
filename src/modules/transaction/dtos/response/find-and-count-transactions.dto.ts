import { IFindAndCountResult } from 'src/common/interfaces/service.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../entities/transaction.entity';

export class FindAndCountTransactionsDto
  implements IFindAndCountResult<Transaction>
{
  @ApiProperty({ type: () => [Transaction] })
  data: Transaction[];
  @ApiProperty()
  count: number;
}
