import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = parseInt(request.headers.authorization);

    if (!userId) {
      throw new UnauthorizedException('No authorization header');
    }

    try {
      const hasPermission = this.usersService.hasPermission(userId, requiredPermission);

      if (!hasPermission) {
        throw new UnauthorizedException(`Not allowed to perform action due to insufficient permissions`);
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid user ID in authorization header');
      }
      throw error;
    }
  }
}