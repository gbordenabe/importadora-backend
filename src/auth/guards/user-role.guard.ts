import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    if (!validRoles.length) return true;
    const user: User = context.switchToHttp().getRequest().user;

    if (!user) throw new InternalServerErrorException('User not found in req');
    for (const role of validRoles) {
      if (role === user.role.name) return true;
    }

    throw new ForbiddenException(
      `User needs a valid role: [${validRoles.join(', ')}]`,
    );
  }
}
