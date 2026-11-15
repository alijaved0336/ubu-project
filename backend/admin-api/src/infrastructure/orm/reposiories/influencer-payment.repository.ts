import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerPayment } from '../entities/influencer-payment.entity';

export class InfluencerPaymentRepository {
  constructor(
    @InjectRepository(InfluencerPayment)
    private readonly influencerPaymentRepo: Repository<InfluencerPayment>,
  ) {}

  async create(data: any) {
    const payment = this.influencerPaymentRepo.create(data);
    console.log("payment",payment)
    return this.influencerPaymentRepo.save(payment);
  }
  

  async findAll(id: number) {
    return this.influencerPaymentRepo.find({
      where: { user: { id } },
    });
  }

  async existsByUserIdAndMonth(userId: number, month: string): Promise<boolean> {
    return this.influencerPaymentRepo
      .createQueryBuilder('payment')
      .where('payment.user_id = :userId', { userId })
      .andWhere('payment.month = :month', { month })
      .getExists();
  }
  
}
