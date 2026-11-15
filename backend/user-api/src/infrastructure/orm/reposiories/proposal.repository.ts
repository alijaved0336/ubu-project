// influencer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Proposal } from '../entities/proposals.entity';

@Injectable()
export class ProposalRepository {

  constructor(
    @InjectRepository(Proposal)
    private readonly proposalRepository: Repository<Proposal>,
  ) {}

  async deleteProposalsByInfluencerId(influencerId: number): Promise<number> {
    const result = await this.proposalRepository.delete({
      influencer: { id: influencerId },
    });
    return result.affected || 0;
  }
  async softDeletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.proposalRepository.softDelete({
      influencer: { id: influencerId },
    });

    return deleteResult.affected || 0;
  }
  async restorSoftDeletePostsByInfluencerId(influencerId: number): Promise<number> {
    const deleteResult = await this.proposalRepository.restore({
      influencer: { id: influencerId },
    });

    return deleteResult.affected || 0;
  }

  async proposalsExistForInfluencer(influencerId: number): Promise<boolean> {
    return this.proposalRepository.exist({
      where: { influencer: { id: influencerId } },
    });
  }

  async proposalsSoftDeletedExistForInfluencer(influencerId: number) {
    return this.proposalRepository.find({
      where: { influencer: { id: influencerId } },
      withDeleted: true, 
    });
  }
}
