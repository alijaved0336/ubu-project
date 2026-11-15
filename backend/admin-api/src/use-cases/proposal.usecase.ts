import { Injectable } from '@nestjs/common';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { ProposalRepository } from '@infrastructure/orm/reposiories/proposal.repository';
import { CreateProposalDto } from '@infrastructure/presentation/proposal/create_proposal.dto';

@Injectable()
export class ProposalUsecase {
  constructor(
    private proposalRepository: ProposalRepository,
    private influencerRepository: InfluencerRepository,
  ) {}

  async createProposals(user_id: number, payload: CreateProposalDto) {
    const influncer = await this.influencerRepository.findInfluncerByUserId(user_id);
    if (influncer) {
      payload.influencerId = influncer.id;
    }
    return this.proposalRepository.insert(payload);
  }

  async showAllProposals(user_id: number) {
    const influncer = await this.influencerRepository.findInfluncerByUserId(user_id);
    if (influncer) {
      return await this.proposalRepository.showProposals(influncer.id);
    }
  }

  async getParticularProposal(perposalId: number) {
    if (perposalId) {
      return await this.proposalRepository.findOne(perposalId);
    }
  }

  async updateProposal(perposalId: number, payload: CreateProposalDto) {
    if (perposalId) {
      return await this.proposalRepository.updateProposal(perposalId, payload);
    }
  }
  async remove(perposalId: number) {
    if (perposalId) {
      return await this.proposalRepository.deleteProposal(perposalId);
    }
  }

  async search(body: any, userId: number) {
    const influncer = await this.influencerRepository.findInfluncerByUserId(userId);
    if (influncer && body.query) {
      return await this.proposalRepository.searchProposals(influncer.id, body.query);
    }
  }
}
