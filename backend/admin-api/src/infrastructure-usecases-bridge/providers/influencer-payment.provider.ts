import { InfluencerPaymentRepository } from '@infrastructure/orm/reposiories/influencer-payment.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import { InfluencerPaymentUseCase } from '@use-cases/influencer.payment.usecase';
import UsecaseProxy, { INFLUENCER_PAYMENT_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { DataSource } from 'typeorm';

export function InfluencerPaymentProvider() {
  return {
    inject: [InfluencerPaymentRepository, StripeService, DataSource, NotificationService],
    provide: INFLUENCER_PAYMENT_PROXY,
    useFactory: (
      influencerPaymentRepo: InfluencerPaymentRepository,
      stripeService: StripeService,
      dataSource: DataSource,
      notificationService: NotificationService,
    ) => new UsecaseProxy(new InfluencerPaymentUseCase(influencerPaymentRepo, stripeService, dataSource, notificationService)),
  };
}
