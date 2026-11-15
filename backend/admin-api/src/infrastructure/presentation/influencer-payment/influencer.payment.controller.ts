import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, { INFLUENCER_PAYMENT_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InfluencerPaymentUseCase } from '@use-cases/influencer.payment.usecase';
import { CreatePaymentIntentDto } from '../campaign-payment/campaign-payment.dto';
import { CreatePayoutDto } from './influencer-payment.dto';
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('/influencerPayments')
@ApiTags('Influencer Payment')
@ApiBearerAuth()
export class InfluencerPaymentController {
  constructor(
    @Inject(INFLUENCER_PAYMENT_PROXY)
    private readonly influencerPaymentUsecase: UsecaseProxy<InfluencerPaymentUseCase>,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Logs details of influncer related to affialte' })
  @ApiResponse({
    status: 201,
    description: 'Funds transferred successfully.',
  })
  async findAll(@Param('id') id: number) {
    return await this.influencerPaymentUsecase.getInstance().findAll(id);
  }

  @Post('/transfer-funds')
  @ApiOperation({ summary: 'Transfer Influencer Funds.' })
  @ApiResponse({
    status: 201,
    description: 'Funds transferred successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  @ApiBody({ type: CreatePaymentIntentDto })
  async transferInfluencerPayment(@Body() body: CreatePayoutDto, @Req() request: any) {
    try {
      const user = request?.user;
      const { amount, currency, connectedAccountId, month, influencer_user_id } = body;
      const influencerPayout = await this.influencerPaymentUsecase
        .getInstance()
        .transferFunds(user?.id, amount, currency, connectedAccountId, month, influencer_user_id);
      return { message: 'Funds transferred successfully.', influencerPayout };
    } catch (error) {
      throw new HttpException({ message: 'Failed to tranfer funds.', error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
