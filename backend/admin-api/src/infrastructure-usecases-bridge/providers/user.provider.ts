import { BrandRepository } from '@infrastructure/orm/reposiories/brand.repository';
import { ConsumerRepository } from '@infrastructure/orm/reposiories/consumer.repository';
import { ForgotPasswordTokenRepository } from '@infrastructure/orm/reposiories/forgot-password-token.repository';
import { InfluencerRepository } from '@infrastructure/orm/reposiories/influencer.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { AwsS3Service } from '@infrastructure/services/aws-s3/aws-s3.service';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { UserUsecase } from '@use-cases/user.usecase';
import UsecaseProxy, { USER_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';

export function UserUsecaseProvider() {
  return {
    inject: [
      UserRepository,
      BrandRepository,
      InfluencerRepository,
      ForgotPasswordTokenRepository,
      BcryptService,
      MailGunService,
      AwsS3Service,
      ConsumerRepository,
      // INFLUENCER_USECASE_PROXY,
    ],
    provide: USER_USECASE_PROXY,
    useFactory: (
      userRepository: UserRepository,
      brandRepository: BrandRepository,
      influencerRepository: InfluencerRepository,
      forgotPasswordTokenRepository: ForgotPasswordTokenRepository,
      bcryptService: BcryptService,
      mailgunService: MailGunService,
      awsS3Service: AwsS3Service,
      consumerRepository: ConsumerRepository,
      // influencerUseCase: UsecaseProxy<InfluencerUsecase>,
    ) =>
      new UsecaseProxy(
        new UserUsecase(
          userRepository,
          brandRepository,
          influencerRepository,
          forgotPasswordTokenRepository,
          bcryptService,
          mailgunService,
          awsS3Service,
          consumerRepository,
          // influencerUseCase,
        ),
      ),
  };
}
