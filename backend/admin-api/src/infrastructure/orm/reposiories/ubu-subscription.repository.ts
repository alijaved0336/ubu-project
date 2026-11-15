import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UBUSubscription } from '../entities/ubuSubscription.entity';

@Injectable()
export class UBUSubscriptionRepository {
  constructor(
    @InjectRepository(UBUSubscription)
    private ubuSubscriptionRepository: Repository<UBUSubscription>,
  ) {}

  async getUserSubscriptionInfo(user_id) {
    return this.ubuSubscriptionRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async getUserSubscriptionsInfo(user_id) {
    const currentDate = new Date();

    return this.ubuSubscriptionRepository.find({
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
  async addSubscriptionInfo(payload) {
    // Convert Unix timestamps to Date objects if they are present in the payload
    if (payload.subs_start_date) {
      payload.subs_start_date = new Date(payload.subs_start_date * 1000);
    }
    if (payload.subs_end_date) {
      payload.subs_end_date = new Date(payload.subs_end_date * 1000);
    }
    const ubuSubscription = this.ubuSubscriptionRepository.create(payload);
    return this.ubuSubscriptionRepository.save(ubuSubscription);
  }

  async updateSubscriptionEndDate(subscriptionId): Promise<void> {
    const currentDate = new Date();
    await this.ubuSubscriptionRepository.update({ id: subscriptionId }, { subs_end_date: currentDate });
  }

  async updateSubscription(condition, payload): Promise<void> {
    await this.ubuSubscriptionRepository.update(condition, payload);
  }
}
