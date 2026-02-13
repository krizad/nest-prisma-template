import { Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { appConstants } from '../constant/app.constants';
import { JwtConfig } from '../../config/interfaces/config.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwtConfig = this.configService.get<JwtConfig>('jwt');

    // If JWT is disabled globally, allow all requests
    if (!jwtConfig?.enabled) {
      return true;
    }

    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      appConstants.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
