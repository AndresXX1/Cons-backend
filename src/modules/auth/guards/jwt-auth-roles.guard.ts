import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AdminService } from '../../admin/admin.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthRolesGuard implements CanActivate {
  constructor(
    private readonly adminService: AdminService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide token');
      }
      const accessToken = authorization.replace(/bearer/gim, '').trim();
      const { user, sessionId } = await this.adminService.validateSession(accessToken);
      request.user = user;
      request.sessionId = sessionId;
      return true;
    } catch (error) {
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
  }
}
