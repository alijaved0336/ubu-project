import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { Controller, Inject, Post, Get, Param, ClassSerializerInterceptor, UseInterceptors, UseGuards, Req, Body, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UbuSubscriptionUsecase } from '@use-cases/ubu-subscription.usecase';
import UsecaseProxy, { UBU_SUBSCRIPTION_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CreateCheckoutSession } from './ubu-subscription.dto';

@Controller('ubusubscription')
@ApiTags('ubusubscription')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UbuSubscriptionController {
  constructor(
    @Inject(UBU_SUBSCRIPTION_USECASE_PROXY)
    private readonly ubuSubscriptionUsecaseProxy: UsecaseProxy<UbuSubscriptionUsecase>,
  ) {}

  @Get('products')
  async findProducts(@Req() request) {
    const user = request.user?.id;
    return this.ubuSubscriptionUsecaseProxy.getInstance().getProducts();
  }

  @Post('create-checkout-session')
  createCheckoutSession(@Body() body: CreateCheckoutSession, @Req() request) {
    const user = request.user?.id;
    return this.ubuSubscriptionUsecaseProxy.getInstance().createCheckoutSession(body, request);
  }

  @Delete('un_subscribe/subscription/:id')
  cancelSubscription(@Param('id') id: string, @Req() request) {
    return this.ubuSubscriptionUsecaseProxy.getInstance().cancelSubscriptions(request, id);
  }

  @Get('get-invoice')
  getInvoice(@Req() request) {
    const user = request.user?.id;
    return this.ubuSubscriptionUsecaseProxy.getInstance().getInvoice(user);
  }
}
