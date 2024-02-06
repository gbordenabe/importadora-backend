import { Role } from '../entities/role.entity';
import { ROLE_NAME_ENUM } from '../entities/role_name.enum';

export const ROLES_DATA: Partial<Role>[] = Object.values(ROLE_NAME_ENUM).map(
  (name) => ({ name }),
);
