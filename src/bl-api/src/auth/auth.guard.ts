/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token']; 

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.authService.verifyToken(token);
      console.log('====================================');
      console.log(decoded);
      console.log('====================================');
      request.user = decoded;

      if (roles && roles.length > 0) {
        const hasRole = roles.some((role) => decoded[role] === true);
        if (!hasRole) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }

      return true;
    } catch (error) {
      console.log(
        'auth error - ',
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new UnauthorizedException(
        error instanceof Error
          ? error.message
          : 'Session expired! Please sign In.',
      );
    }
  }
}
