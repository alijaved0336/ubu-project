import { AffiliateReportRepository } from '@infrastructure/orm/reposiories/affiliate-report.repository';
import { AffliateProductableRepository } from '@infrastructure/orm/reposiories/affliate-productable.repository';
import { CategoryRepository } from '@infrastructure/orm/reposiories/category.repository';
import { ContactUsRepository } from '@infrastructure/orm/reposiories/contact-us.repository';
import { EmailCapturedForIOSRepository } from '@infrastructure/orm/reposiories/email-capture-for-ios.repository';
import { GenderRepository } from '@infrastructure/orm/reposiories/gender.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { QuestionnaireRepository } from '@infrastructure/orm/reposiories/questionnaire.repository';
import { SizeRepository } from '@infrastructure/orm/reposiories/size.repository';
import { StyleRepository } from '@infrastructure/orm/reposiories/style.repository';
import { SubCategoryRepository } from '@infrastructure/orm/reposiories/sub-category.repository';
import { SubscriberRepository } from '@infrastructure/orm/reposiories/subscriber.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { TwilioService } from '@infrastructure/services/twilio/twilio.service';
import { CommonUsecase } from '@use-cases/common.usecase';
import { InfluencerUsecase } from '@use-cases/influencer.usecase';
import { InstagramUsecase } from '@use-cases/instagram.usecase';
import { PostsUsecase } from '@use-cases/posts.usecase';
import { UserUsecase } from '@use-cases/user.usecase';
import UsecaseProxy, {
  COMMON_USECASE_PROXY,
  INSTAGRAM_USECASE_PROXY,
  POST_USECASE_PROXY,
  USER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';

export function CommonUsecaseProvider() {
  return {
    inject: [
      CategoryRepository,
      StyleRepository,
      SubCategoryRepository,
      SizeRepository,
      GenderRepository,
      QuestionnaireRepository,
      ContactUsRepository,
      EmailCapturedForIOSRepository,
      InfluencerRepository,
      INSTAGRAM_USECASE_PROXY,
      POST_USECASE_PROXY,
      MailGunService,
      TwilioService,
      SubscriberRepository,
      AffliateProductableRepository,
      AffiliateReportRepository,
      UserRepository,
      USER_USECASE_PROXY,
    ],
    provide: COMMON_USECASE_PROXY,
    useFactory: (
      categoryRepository: CategoryRepository,
      styleRepository: StyleRepository,
      subCategoryRepository: SubCategoryRepository,
      sizeRepository: SizeRepository,
      genderRepository: GenderRepository,
      questionnaireRepository: QuestionnaireRepository,
      contactUsRepository: ContactUsRepository,
      emailCaptureRepository: EmailCapturedForIOSRepository,
      influencerRepository: InfluencerRepository,
      instagramUsecase: UsecaseProxy<InstagramUsecase>,
      postUsecase: UsecaseProxy<PostsUsecase>,
      mailgunService: MailGunService,
      twilioService: TwilioService,
      subscriberRepository: SubscriberRepository,
      affliateProductableRepository: AffliateProductableRepository,
      affiliateWeeklyReportRepository: AffiliateReportRepository,
      userRepository: UserRepository,
      userUsecase: UsecaseProxy<UserUsecase>,
    ) =>
      new UsecaseProxy(
        new CommonUsecase(
          categoryRepository,
          styleRepository,
          subCategoryRepository,
          sizeRepository,
          genderRepository,
          questionnaireRepository,
          contactUsRepository,
          emailCaptureRepository,
          influencerRepository,
          instagramUsecase,
          postUsecase,
          mailgunService,
          twilioService,
          subscriberRepository,
          affliateProductableRepository,
          userRepository,
          affiliateWeeklyReportRepository,
          userUsecase,
        ),
      ),
  };
}
