import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Proposal } from '../entities/proposals.entity';
import { Influencers } from '../entities/influencer.entity';

export class ProposalRepository {
  constructor(
    @InjectRepository(Proposal)
    @InjectRepository(Influencers)
    private readonly proposalRepo: Repository<Proposal>,
  ) {}

  async insert(proposal: Partial<Proposal>) {
    console.log('payloaddddd', proposal);
    await await this.proposalRepo.create(proposal);
    return await this.proposalRepo.save(proposal);
  }
  async showProposals(influencer_id: number) {
    return await this.proposalRepo.find({
      where: { influencer: { id: influencer_id } }, // Filtering by influencer_id
      relations: ['influencer'], // Optional: Load related influencer data if needed
    });
  }

  async findOne(proposalId: number) {
    return await this.proposalRepo.findOne({ where: { id: proposalId } }); // Find proposal by ID
  }

  async updateProposal(proposalId: number, updatedData: Partial<Proposal>) {
    console.log(updatedData);
    const proposal = await this.proposalRepo.findOne({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new Error(`Proposal with ID ${proposalId} not found`);
    }

    // Merge the existing proposal with the new data
    const updatedProposal = Object.assign(proposal, updatedData);
    return await this.proposalRepo.save(updatedProposal);
  }

  async deleteProposal(proposalId: number) {
    // Find the proposal first, if not found return an error or handle accordingly
    const proposal = await this.proposalRepo.findOne({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new Error(`Proposal with ID ${proposalId} not found`);
    }

    // Delete the proposal
    const aa = await this.proposalRepo.remove(proposal);
    console.log(aa);
    return { message: aa };
  }

  async deleteProposalsByInfluencerdId(influencerId: number): Promise<number> {
    const deleteResult = await this.proposalRepo?.delete({
      influencer: { id: influencerId },
    });

    return deleteResult?.affected || 0;
  }

  async searchProposals(influencer_id: number, value: string) {
    return await this.proposalRepo.find({
      where: { influencer: { id: influencer_id }, name: ILike(`%${value}%`) },
      relations: ['influencer'],
    });
  }
}
