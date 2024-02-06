import { User } from 'src/modules/user/entities/user.entity';

export const getOptionalUser = (requestUser?: User) => {
  return requestUser ? { id: requestUser.id } : undefined;
};
