import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userApiToken = request.headers['x-user-api-token'];

    // If special token is present, allow access without JWT validation
    if (userApiToken && userApiToken === this.configService.get('myConfig')?.userApiToken) {
      // Set a special user object for service access
      request.user = {
        specialAccess: true,
        type: 'service',
        id: 'service-access',
      };
      return true;
    }

    // Otherwise, proceed with normal JWT validation
    return super.canActivate(context);
  }
}
