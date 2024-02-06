import { IFindAndCountResult } from 'src/common/interfaces/service.interface';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FindAndCountUsersDto implements IFindAndCountResult<User> {
  @ApiProperty({ type: () => [User] })
  data: User[];
  @ApiProperty()
  count: number;
}
