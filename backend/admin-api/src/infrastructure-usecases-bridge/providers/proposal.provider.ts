import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { ProposalRepository } from '@infrastructure/orm/reposiories/proposal.repository';
import { ProposalUsecase } from '@use-cases/proposal.usecase';
import UsecaseProxy, { PROPOSAL_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ProposalUsecaseProvider() {
  return {
    inject: [ProposalRepository, InfluencerRepository],
    provide: PROPOSAL_USECASE_PROXY,
    useFactory: (proposalRepository: ProposalRepository, influencerRepository: InfluencerRepository) =>
      new UsecaseProxy(new ProposalUsecase(proposalRepository, influencerRepository)),
  };
}
