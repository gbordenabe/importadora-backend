import { IFindAndCountResult } from 'src/common/interfaces/service.interface';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../entities/client.entity';

export class FindAndCountClientsDto implements IFindAndCountResult<Client> {
  @ApiProperty({ type: () => [Client] })
  data: Client[];
  @ApiProperty()
  count: number;
}
