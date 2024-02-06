import { User } from 'src/modules/user/entities/user.entity';

export interface IUserLog {
  requestUser: User;
  isAdministrator: boolean;
}
