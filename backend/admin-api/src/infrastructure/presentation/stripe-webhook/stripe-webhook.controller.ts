import { ClassSerializerInterceptor, Controller, Inject, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeWebhookUsecase } from '@use-cases/stripe-webhook.usecase';
import UsecaseProxy, { STRIPE_WEBHOOK_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
// import { StripeWebhookService } from './stripe-webhook.service';

@Controller('stripe-webhooks')
@ApiTags('stripe-webhooks')
@UseInterceptors(ClassSerializerInterceptor)
export class StripeWebhookController {
  constructor(
    @Inject(STRIPE_WEBHOOK_USECASE_PROXY)
    private readonly stripeWebhookUsecaseProxy: UsecaseProxy<StripeWebhookUsecase>,
  ) {}

  @Post()
  async webhook(@Req() request, @Res() response) {
    const rawBody = request.body; // Should be a Buffer
    const signature = request.headers['stripe-signature'] as string;
    return this.stripeWebhookUsecaseProxy.getInstance().webhook(rawBody, signature, response);
  }
}
