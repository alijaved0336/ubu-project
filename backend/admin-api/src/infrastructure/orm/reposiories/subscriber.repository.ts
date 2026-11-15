import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Page, Subscriber } from '../entities/subscriber.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubscriberRepository {
  constructor(
    @InjectRepository(Subscriber)
    private readonly subscriber: Repository<Subscriber>,
  ) {}

  async createSubscriber(email: string, page: Page): Promise<Subscriber> {
    try {
      const subscriber = this.subscriber.create({ email, page });
      return await this.subscriber.save(subscriber);
    } catch (error) {
      throw error;
    }
  }

  async createSubscriberUsingPhone(phone_number: string, page: Page): Promise<Subscriber> {
    const subscriber = this.subscriber.create({ phone_number, page });
    return this.subscriber.save(subscriber);
  }

  async findAllSubscribers(skip = 0, take = 10, search?: string) {  
    const whereCondition = search
      ? [
          { email: ILike(`%${search}%`) },
        ]
      : [];
  
    const [subscribers, totalSubscribers] = await this.subscriber.findAndCount({
      where: whereCondition.length ? whereCondition : undefined,
      skip,
      take,
    });
  
    // Calculate next page
    const nextPage = skip + take < totalSubscribers ? Math.floor(skip / take) + 2 : null;
  
    return { subscribers, totalCount: totalSubscribers, nextPage };
  }
  
  async findByCondition(condition) {
    return this.subscriber.find({
      where: condition,
    });
  }

  async deleteSubscriber(email: string): Promise<void> {
    await this.subscriber.delete({ email });
  }
}
