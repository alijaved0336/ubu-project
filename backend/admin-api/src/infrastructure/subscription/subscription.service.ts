// src/modules/subscription/services/subscription.service.ts
import { UBUSubscription } from '@infrastructure/orm/entities/ubuSubscription.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UBUSubscription)
    private readonly ubuSubscriptionRepository: Repository<UBUSubscription>,
  ) {}

  userInfo(user_email) {
    return this.userRepository.findOne({
      where: {
        email: user_email,
      },
    });
  }

  userSubscriptionInfo(user_id) {
    const currentDate = new Date();
    return this.ubuSubscriptionRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
        subs_start_date: LessThanOrEqual(currentDate),
        subs_end_date: MoreThanOrEqual(currentDate),
      },
      order: {
        created_at: 'DESC',
      },
    });
  }
  // Example: Check subscription details
  validateSubscription(userPlan: string, requiredPlans: string[]): boolean {
    return requiredPlans.includes(userPlan);
  }
}
