import { SubscriptionService } from '@infrastructure/subscription/subscription.service';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlans = this.reflector.get<string[]>('plans', context.getHandler());
    console.log('Required plans are :::: ', requiredPlans);
    if (!requiredPlans) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.findAuthorizationToken(request.rawHeaders);
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    const userInfo = await this.subscriptionService.userInfo(decodedToken.email);
    const subscriptionInfo = await this.subscriptionService.userSubscriptionInfo(userInfo?.id);
    // const validation = this.subscriptionService.validateSubscription('basic', ['enterprise'])

    if (!userInfo || !subscriptionInfo || !requiredPlans.includes(subscriptionInfo?.plan_type)) {
      throw new ForbiddenException('Access denied: insufficient subscription plan');
    }
    return true;
  }

  findAuthorizationToken(headers) {
    const index = headers.indexOf('Authorization');
    if (index !== -1 && headers[index + 1]) {
      const authorizationValue = headers[index + 1]; // Get the value after "Authorization"
      if (authorizationValue.startsWith('Bearer ')) {
        return authorizationValue.slice(7); // Remove "Bearer " prefix
      }
    }
    return null; // Return null if Authorization is not found
  }
}
