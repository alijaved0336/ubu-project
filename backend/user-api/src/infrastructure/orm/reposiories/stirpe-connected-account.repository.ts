import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAnswer } from '../entities/user-answer.entity';
import { InfluencerStripeConnectedAccount } from '../entities/influencer-stripe-connected-account.entity';

@Injectable()
export class InfluencerStripeConnectedAccountRepository {
  constructor(
    @InjectRepository(InfluencerStripeConnectedAccount)
    private readonly influencerStripeConnectedAccountRepo: Repository<InfluencerStripeConnectedAccount>,
  ) {}

  async findAccountIdByInfluencerId(id: number){
    return this.influencerStripeConnectedAccountRepo.findOne({where:{influencer: {id}}})
  }

}
