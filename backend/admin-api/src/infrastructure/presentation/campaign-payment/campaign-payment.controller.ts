import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  HttpException,
  HttpStatus,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import UsecaseProxy, { CAMPAIGN_PAYMENT_USECASE_PROXY } from 'infrastructure-usecases-bridge/usecase-proxy';
import { CreatePaymentIntentDto, CreateConnectedAccountDto, ReleaseFundsDto, GetTransactionLogsDto, UpdateConnectedAccountDto } from './campaign-payment.dto';
import { CampaignPaymentUseCase } from '@use-cases/campaign-payment.usecase';
import { ICampaignTransactionLogs } from '@domain/interfaces/campaign-payement.interface';
import { CURRENCY } from 'constants/currency';

@ApiTags('CampaignPayment')
@Controller('campaignPayment')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CampaignPaymentController {
  constructor(
    @Inject(CAMPAIGN_PAYMENT_USECASE_PROXY)
    private readonly campaignPaymentUsecaseProxy: UsecaseProxy<CampaignPaymentUseCase>,
  ) {}

  // Brand Operation
  @Post('create-payment-intent')
  @ApiOperation({ summary: 'Create a payment intent.' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request data.' })
  @ApiBody({ type: CreatePaymentIntentDto })
  async createPaymentIntent(@Body() body: CreatePaymentIntentDto, @Req() request: any) {
    try {
      const user_id = request.user?.id;
      const { amount, currency, metadata, campaign_id } = body;
      const paymentIntent = await this.campaignPaymentUsecaseProxy
        .getInstance()
        .createPaymentIntent(amount, currency, metadata, campaign_id, user_id, request.user);
      return { message: 'Payment intent created successfully.', paymentIntent };
    } catch (error) {
      throw new HttpException({ message: 'Failed to create payment intent.', error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  // Influencer Operation
  @Get('country-list')
  @ApiOperation({ summary: 'Retrieve a list of supported countries' })
  @ApiResponse({
    status: 200,
    description: 'Country list retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve the country list.',
  })
  async getCountryList() {
    try {
      const countries = await this.campaignPaymentUsecaseProxy.getInstance().getCountryList();

      return {
        message: 'Country list retrieved successfully.',
        data: countries,
      };
    } catch (error) {
      console.error('Error retrieving country list:', error.message);
      throw new HttpException(
        {
          message: 'Failed to retrieve the country list.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Influencer Operation
  @Post('create-connected-account')
  @ApiOperation({ summary: 'Create a connected account for payouts.' })
  @ApiResponse({
    status: 201,
    description: 'Connected account successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid email address.' })
  @ApiBody({ type: CreateConnectedAccountDto })
  async createConnectedAccount(@Body() body: CreateConnectedAccountDto, @Req() request: any) {
    try {
      const influencer_id = request.user?.influencer?.id;
      const { email, country, refreshUrl, returnUrl } = body;
      const first_name = request.user?.first_name;
      const last_name = request.user?.last_name;
      const account = await this.campaignPaymentUsecaseProxy
        .getInstance()
        .createOrUpdateAccountLink(email, country, first_name, last_name, refreshUrl, returnUrl, influencer_id);
      return { message: 'Connected account created successfully.', account };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create connected account.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('update-connected-account')
  @ApiOperation({ summary: 'Update the connected account for payouts.' })
  @ApiResponse({
    status: 201,
    description: 'Connected account successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid email address.' })
  @ApiBody({ type: UpdateConnectedAccountDto })
  async updateConnectedAccount(@Body() body: UpdateConnectedAccountDto, @Req() request: any) {
    try {
      const influencer_id = request.user?.influencer?.id;
      const { city, country, postal_code, state, phone, addressLine1, ssn, bankRoutingNumber, bankAccountNumber, ipAddress } = body;
      const dob = new Date(request.user?.dob);
      const account = await this.campaignPaymentUsecaseProxy
        .getInstance()
        .updateConnectedAccount(
          influencer_id,
          phone,
          dob,
          addressLine1,
          city,
          state,
          postal_code,
          ssn,
          country,
          bankRoutingNumber,
          bankAccountNumber,
          ipAddress,
        );

      return { message: 'Connected account updated successfully.', account };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to create connected account.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  // Influencer Operation
  @Get('connected-account/details')
  @ApiOperation({
    summary: 'Retrieve and update the status of connected Stripe account details',
  })
  @ApiResponse({
    status: 200,
    description: 'Connected account details retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to retrieve connected account details.',
  })
  async getOrUpdateConnectedAccountDetails(@Req() request: any): Promise<{ message: string; data: any }> {
    try {
      const influencer_id = request.user?.influencer?.id;
      if (!influencer_id) {
        throw new HttpException('influencer_id of connected account is missing.', HttpStatus.BAD_REQUEST);
      }
      const accountInfo = await this.campaignPaymentUsecaseProxy.getInstance().getOrUpdateConnectedAccountDetails(influencer_id);
      return {
        message: 'Connected account details retrieved successfully.',
        data: accountInfo,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Failed to retrieve connected account details.',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Brand Operation
  @Post('release-funds')
  @ApiOperation({ summary: 'Release funds to a connected account.' })
  @ApiResponse({ status: 201, description: 'Funds successfully released.' })
  @ApiResponse({ status: 400, description: 'Invalid fund transfer request.' })
  @ApiBody({ type: ReleaseFundsDto })
  async releaseFunds(@Body() body: ReleaseFundsDto, @Req() request: any) {
    try {
      const user_id = request?.user?.id;
      const { campaign_id } = body;
      const currency = CURRENCY.USD;
      const transfer = await this.campaignPaymentUsecaseProxy.getInstance().scheduleTransfer(currency, campaign_id, user_id, null);
      return { transfer };
    } catch (error) {
      throw new HttpException({ message: 'Failed to release funds.', error: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('transactions-logs')
  @ApiOperation({ summary: 'Get user transactions.' })
  @ApiResponse({
    status: 200,
    description: 'Transaction logs retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async handleTransactions(@Req() request: any, @Query() query: GetTransactionLogsDto): Promise<any> {
    const pageNumber = query.page ?? 1;
    const pageSize = query.limit ?? 10;

    try {
      const user = request.user;

      if (!user) {
        throw new BadRequestException('User information is missing.');
      }

      console.log('Fetching transaction logs for user:', user);
      const data: ICampaignTransactionLogs = {
        pageNumber,
        pageSize,
        user,
        ...query,
      };

      const result = await this.campaignPaymentUsecaseProxy.getInstance().getTransactionLogs(data);

      return {
        message: 'Transaction logs retrieved successfully.',
        result,
      };
    } catch (error) {
      console.error('Error fetching transaction logs:', error);

      throw new HttpException(
        {
          message: 'Failed to retrieve transaction logs.',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('transactions-summary')
  @ApiOperation({ summary: 'Get user transactions Summary.' })
  @ApiResponse({
    status: 200,
    description: 'Transaction Summary retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async transactionSummary(@Req() request: any): Promise<any> {
    try {
      const user = request.user;

      if (!user) {
        throw new BadRequestException('User information is missing.');
      }

      console.log('Fetching transaction logs for user:', user);

      const result = await this.campaignPaymentUsecaseProxy.getInstance().getTransactionSummary(user);

      return {
        message: 'Transaction Summary retrieved successfully.',
        result,
      };
    } catch (error) {
      console.error('Error fetching transaction Summary:', error);

      throw new HttpException(
        {
          message: 'Failed to retrieve transaction Summary.',
          error: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin Operation
  /*   @Post('payout')
    @ApiOperation({ summary: 'Create a payout to a connected account.' })
    @ApiResponse({ status: 201, description: 'Payout successfully created.' })
    @ApiResponse({ status: 400, description: 'Failed to create payout.' })
    @ApiBody({ type: CreatePayoutDto })
    async createPayout(@Body() payoutDto: CreatePayoutDto) {
      try
      {
        const { amount, currency, connectedAccountId } = payoutDto;
        const payout = await this.campaignPaymentUsecaseProxy
          .getInstance()
          .createPayout(amount, currency, connectedAccountId);
        return { message: 'Payout successfully created.', payout };
      } catch (error)
      {
        throw new HttpException(
          { message: 'Failed to create payout.', error: error.message },
          HttpStatus.BAD_REQUEST,
        );
      }
    } */
}
