import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { Inject } from '@nestjs/common';
import UsecaseProxy, { USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { UserUsecase } from './user.usecase';

export class AffiliateReportUsecase {
  constructor(
    private affiliateReportRepository: AffiliateReportRepository,
    @Inject(USER_USECASE_PROXY)
    private readonly userUseCase: UsecaseProxy<UserUsecase>,
  ) {}

  async fetchAffiliateGraphsData(userId: number) {
    const user = await this.userUseCase.getInstance().findById(userId);
    let type = 'brand';
    let id = 0;
    if (user) {
      if (user.is_brand) {
        type = 'brand';
        id = user.brand.id;
      } else {
        type = 'influencer';
        id = user.influencer.id;
      }

      return await this.affiliateReportRepository.getMonthlySales(id, type);
    }
  }

  async userTranscations(userId: number) {
    const user = await this.userUseCase.getInstance().findById(userId);
    let type = 'brand';
    let id = 0;
    if (user) {
      if (user.is_brand) {
        type = 'brand';
        id = user.brand.id;
      } else {
        type = 'influencer';
        id = user.influencer.id;
      }

      // Fetch the entries from the repository
      return await this.affiliateReportRepository.getAllEntries(id, type);
    }
  }
}
