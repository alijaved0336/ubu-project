import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { ContractRepository } from '@infrastructure/orm/reposiories/contract.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { ContractUsecase } from '@use-cases/contract.usecase';
import UsecaseProxy, { CONTRACT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function ContractUsecaseProvider() {
  return {
    inject: [AwsS3Service, MailGunService, CampaignRepository, ContractRepository, UserRepository],
    provide: CONTRACT_USECASE_PROXY,
    useFactory: (
      awsS3Service: AwsS3Service,
      mailgunService: MailGunService,
      campaignRepository: CampaignRepository,
      contractRepository: ContractRepository,
      userRepository: UserRepository,
    ) => new UsecaseProxy(new ContractUsecase(awsS3Service, mailgunService, campaignRepository, contractRepository, userRepository)),
  };
}
