import { SetMetadata } from '@nestjs/common';
import { ROLE_NAME_ENUM } from 'src/modules/role/entities/role_name.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ROLE_NAME_ENUM[]) => {
  return SetMetadata(META_ROLES, args);
};
