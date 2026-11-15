import { ICampaignTransactionLogs } from '@domain/interfaces/campaign-payement.interface';
import { FundReleaseStatus } from '@infrastructure/orm/entities/campaign-fund-release.entity';
import { CampaignPayment, CampaignPaymentStatus } from '@infrastructure/orm/entities/campaign-payment.entity';
import { InfluencerStripeAccountStatus } from '@infrastructure/orm/entities/influencer-stripe-connected-account.entity';
import { Refund, RefundStatus } from '@infrastructure/orm/entities/refund.entity';
import { User } from '@infrastructure/orm/entities/user.entity';
import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { RefundPaymentRepository } from '@infrastructure/orm/reposiories/refund-payment.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import { CampaignStatus } from '@infrastructure/utils/constant';
import { BadRequestException, HttpException, HttpStatus, InternalServerErrorException, Logger } from '@nestjs/common';
import { PlatformFee, StripeFee } from 'constants/campaign';
import { CURRENCY } from 'constants/currency';
import { DataSource, In, LessThan, QueryRunner } from 'typeorm';

const _ = require('lodash');

interface NotificationData {
  sender: number;
  recipient: number;
  content: string;
  type: string;
  senderType: string;
  receiverType: string;
  receiverCheck: string;
  campaignId: number;
}

export class CampaignPaymentUseCase {
  private readonly logger = new Logger(CampaignPaymentUseCase.name);
  constructor(
    private campaignPaymentRepository: CampaignPaymentRepository,
    private stripeService: StripeService,
    private campaignRepository: CampaignRepository,
    private refundPaymentRepository: RefundPaymentRepository,
    private mailgunService: MailGunService,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  async calculateGrossAmount(netAmount: number): Promise<number> {
    netAmount = +this.roundToTwoDecimalPlaces(netAmount);
    const stripeFlatFeeInDolars = StripeFee.STRIPE_FLAT_FEE / 100;
    const numerator = +netAmount + +stripeFlatFeeInDolars;
    const denominator = 1 - StripeFee.STRIPE_PERCENTAGE_VALUE;
    const totalAmount = +this.roundToTwoDecimalPlaces(numerator / denominator);
    const grossAmountInCents = Math.floor(totalAmount * 100);
    return grossAmountInCents;
  }

  roundToTwoDecimalPlaces(value) {
    let valueInNumber = Number(value);

    if (isNaN(valueInNumber)) {
      return value;
    }

    const numberInString = parseFloat(valueInNumber.toString()).toFixed(2);

    const parts = numberInString.split('.');
    const integerPart = +(parts?.[0] ?? 0);
    const decimalPart = parts?.[1] ?? '';

    return `${integerPart}.${decimalPart}`;
  }

  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, any>, campaignId: number, userId: number, user: Record<string, any>) {
    const result = await this.campaignRepository.getOneWithLatestDocument(campaignId);
    if (!result?.exhibitDocuments?.length) {
      throw new HttpException('Campaign is not valid', HttpStatus.BAD_REQUEST);
    }
    const documentWithGreatestId = result?.exhibitDocuments?.reduce((max, doc) => (doc.id > max.id ? doc : max));
    const campaign_amount = documentWithGreatestId?.totalCompensation;
    const grossAmount = await this.calculateGrossAmount(campaign_amount);
    if (grossAmount != amount) {
      throw new HttpException('Amount is not valid', HttpStatus.BAD_REQUEST);
    }
    const createdPayment = await this.stripeService.createPaymentIntent(amount, currency, metadata);
    const payload = this.campaignPaymentMap(createdPayment, metadata, campaignId, userId);
    await this.campaignPaymentRepository.addCampaignPayment(payload);
    return createdPayment;
  }

  campaignPaymentMap(createdPayment, metadata, campaignId, userId) {
    return {
      payment_intent_id: createdPayment.id,
      status: CampaignPaymentStatus.IN_COMPLETE,
      amount: createdPayment.amount,
      currency: createdPayment.currency,
      campaign: {
        id: campaignId,
      },
      metadata,
      user: {
        id: userId,
      },
    };
  }

  async getDestinationAccount(campaignId: number): Promise<{
    stripeConnectedAccountId: string | null;
    campaignPaymentId: number | null;
    influencerId: number | null;
  }> {
    return this.campaignPaymentRepository.getDestinationAccount(campaignId);
  }

  async createOrUpdateAccountLink(
    email: string,
    country: string,
    first_name: string,
    last_name: string,
    returnUrl: string,
    refreshUrl: string,
    influencerId: number,
  ) {
    const connectedAccount = await this.campaignPaymentRepository.getConnectedAccountByInfluencer(influencerId);
    if (!connectedAccount) {
      const createdAccount = await this.stripeService.createConnectedAccount(email, country, first_name, last_name);
      const accountLink = await this.stripeService.createAccountLink(createdAccount.id, returnUrl, refreshUrl);
      const payload = {
        stripe_connected_account_id: createdAccount.id,
        status: InfluencerStripeAccountStatus.IN_ACTIVE,
        influencer: {
          id: influencerId,
        },
      };
      await this.campaignPaymentRepository.addConnectedAccount(payload);

      return {
        createdAccount,
        accountLink,
      };
    }
    if (connectedAccount.status === InfluencerStripeAccountStatus.COMPLETED) {
      return 'Account already set up';
    }
    const accountLink = await this.stripeService.createAccountLink(connectedAccount.stripe_connected_account_id, returnUrl, refreshUrl);
    return { accountLink };
  }

  async updateConnectedAccount(
    influencerId: number,
    phone: string,
    dob: Date,
    addressLine1: string,
    addressCity: string,
    addressState: string,
    addressPostalCode: string,
    ssn: string,
    country: string,
    bankRoutingNumber: string,
    bankAccountNumber: string,
    ipAddress: string,
  ) {
    const connectedAccount = await this.campaignPaymentRepository.getConnectedAccountByInfluencer(influencerId);
    if (connectedAccount) {
      const createdAccount = await this.stripeService.updateStripeAccount(
        connectedAccount.stripe_connected_account_id,
        phone,
        dob.getDate(),
        dob.getMonth(),
        dob.getFullYear(),
        addressLine1,
        addressCity,
        addressState,
        addressPostalCode,
        ssn,
        country,
        bankRoutingNumber,
        bankAccountNumber,
        ipAddress,
      );

      return {
        createdAccount,
      };
    }
  }

  async createConnectedAccount(email: string, country: string, first_name: string, last_name: string) {
    return this.stripeService.createConnectedAccount(email, country, first_name, last_name);
  }

  async createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
    try {
      return this.stripeService.createAccountLink(accountId, returnUrl, refreshUrl);
    } catch (error) {
      console.error('Failed to create account link:', error.message);
    }
  }

  async updateCampaignPayment(condition, updatePayload: Partial<CampaignPayment>, queryRunner: QueryRunner) {
    return this.campaignPaymentRepository.updateCampaignPayment(condition, updatePayload, queryRunner);
  }

  async getOrUpdateConnectedAccountDetails(influencerId: number): Promise<{
    accountInfo: Record<string, any>;
    updatedConnectedAccount: Record<string, any>;
  } | null> {
    try {
      if (!influencerId || influencerId <= 0) {
        this.logger.warn('Invalid influencer ID provided.');
        throw new Error('Invalid influencer ID.');
      }

      const stripeConnectedAccount = await this.campaignPaymentRepository.getConnectedAccountByInfluencer(influencerId);

      if (!stripeConnectedAccount || !stripeConnectedAccount.stripe_connected_account_id) {
        this.logger.warn(`No Stripe connected account found for influencer ID: ${influencerId}`);
        return null;
      }

      const accountInfo = await this.stripeService.retrieveAccount(stripeConnectedAccount.stripe_connected_account_id);

      if (!accountInfo) {
        this.logger.error(`Failed to retrieve account info for Stripe connected account ID: ${stripeConnectedAccount.stripe_connected_account_id}`);
        throw new Error('Unable to retrieve account information from Stripe.');
      }

      const canSend = this.canSendPayment(accountInfo);
      let status: InfluencerStripeAccountStatus = canSend.status ? InfluencerStripeAccountStatus.COMPLETED : InfluencerStripeAccountStatus.PENDING;

      if (accountInfo.details_submitted && status !== InfluencerStripeAccountStatus.COMPLETED) {
        status = InfluencerStripeAccountStatus.IN_PROGRESS;
      }

      const updatedConnectedAccount = await this.campaignPaymentRepository.updateStripeConnectedAccount(
        { stripe_connected_account_id: accountInfo.id },
        { status },
      );

      if (!updatedConnectedAccount) {
        this.logger.error(`Failed to update connected account for influencer ID: ${influencerId}`);
        throw new Error('Failed to update connected account details.');
      }

      return {
        accountInfo,
        updatedConnectedAccount,
      };
    } catch (error) {
      this.logger.error(`Error in getOrUpdateConnectedAccountDetails: ${error.message}`, error.stack);
      throw new Error('An error occurred while processing connected account details. Please try again later.');
    }
  }

  async scheduleTransfer(currency: string, campaignId: number, userId, releasedBy, queryRunnerParams?: QueryRunner) {
    let queryRunner = this.dataSource.createQueryRunner();
    if (queryRunnerParams) {
      queryRunner = queryRunnerParams;
    } else {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }
    try {
      if (!userId && !releasedBy) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }
      const isValidTransaction = await this.isValidTransaction(campaignId, userId);
      if (!isValidTransaction.isValid) {
        throw new HttpException('Transaction is not valid', HttpStatus.BAD_REQUEST);
      }

      const { stripeConnectedAccountId, campaignPaymentId, influencerId } = await this.campaignPaymentRepository.getDestinationAccount(campaignId);
      if (!stripeConnectedAccountId) {
        throw new HttpException('Influencer needs to add their account', HttpStatus.BAD_REQUEST);
      }

      if (!campaignPaymentId) {
        throw new HttpException('Brand should add the payment for the campaign', HttpStatus.BAD_REQUEST);
      }
      if (!influencerId) {
        throw new HttpException('Campaign Should have Influencer', HttpStatus.BAD_REQUEST);
      }
      const paymentIntentId = isValidTransaction?.campaignPayment?.payment_intent_id;
      const balanceInfo = await this.stripeService.getBalanceByPaymentIntentId(paymentIntentId);
      const { net: amount, status } = balanceInfo.balanceTransaction;

      if (status !== 'available') {
        throw new HttpException(
          'The payment is in progress. Once available on the platform, it will be processed, typically within 7-10 days.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!amount) {
        throw new HttpException('Amount should be greater than zero', HttpStatus.BAD_REQUEST);
      }

      const accountInfo = await this.stripeService.retrieveAccount(stripeConnectedAccountId);
      const canSend = this.canSendPayment(accountInfo);
      if (!canSend.status) {
        throw new HttpException(canSend.message, HttpStatus.BAD_REQUEST);
      }

      const finalAmount = Math.round(amount - (amount * PlatformFee.PERCENTAGE_20) / 100);

      await this.campaignPaymentRepository.updateCampaignPayment(
        { id: campaignPaymentId },
        {
          is_transferred: true,
          status: CampaignPaymentStatus.TRANSFERRED,
        },
        queryRunner,
      );
      const payload = {
        amount: finalAmount,
        transfer_id: null,
        status: FundReleaseStatus.PENDING,
        cooling_period_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Ensure it's a Date object
        campaignPayment: {
          id: campaignPaymentId,
        },
        influencer: {
          id: influencerId,
        },
        user: {
          id: userId ? userId : releasedBy,
        },
      };

      const fundRelease = await this.campaignPaymentRepository.addFundRelease(payload, queryRunner);

      await this.campaignRepository.update(
        campaignId,
        {
          status: CampaignStatus.FUNDS_TRANSFERRED,
        },
        queryRunner,
      );

      const { influencerId: retrievedInfluencerId } = await this.getInfluencerAndUserIds(campaignPaymentId, queryRunner);

      await this.sendNotification(
        userId ?? releasedBy!,
        retrievedInfluencerId,
        campaignId,
        'Brand has Released the Payment',
        'PAYMENT',
        'brand',
        'influencer',
        'influencer',
      );

      if (!queryRunnerParams) await queryRunner.commitTransaction();

      return {
        data: fundRelease,
        message: 'Transferred scheduled successfully',
      };
    } catch (error) {
      if (!queryRunnerParams) await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error.message);
      throw new Error(`${error.message}`);
    } finally {
      if (!queryRunnerParams) await queryRunner.release();
    }
  }

  async getInfluencerAndUserIds(campaignPaymentId: number, queryRunner?: QueryRunner): Promise<{ influencerId: number; userId: number }> {
    const fundReleaseRecord = await this.campaignPaymentRepository.getFundReleases(campaignPaymentId, queryRunner);
    if (!fundReleaseRecord) {
      throw new Error(`Fund release record not found for CampaignPaymentId: ${campaignPaymentId}`);
    }
    const { influencer, user } = fundReleaseRecord;
    return {
      influencerId: influencer?.id,
      userId: user?.id,
    };
  }

  async sendNotification(
    userId: number,
    influencerId: number,
    campaignId: number,
    content: string,
    type: string,
    senderType: string,
    receiverType: string,
    receiverCheck: string,
  ): Promise<void> {
    const notificationData: NotificationData = {
      sender: userId,
      recipient: influencerId,
      content,
      type,
      senderType,
      receiverType,
      receiverCheck,
      campaignId,
    };
    await this.notificationService.handlePushNotification(notificationData);
  }

  async processScheduledTransfers() {
    const currency = CURRENCY.USD; //THis will be dynamic in future
    const now = new Date();
    const pendingTransfers = await this.campaignPaymentRepository.getPendingTransfers({
      status: FundReleaseStatus.PENDING,
      cooling_period_end: LessThan(now),
    });

    for (const transferData of pendingTransfers) {
      const { id, amount, campaignPayment } = transferData;
      const { id: campaignId } = transferData?.campaignPayment?.campaign;
      if (!campaignId) {
        console.error(`Skipping transfer ${id} - No Campaign`);
        continue;
      }
      const { stripeConnectedAccountId } = await this.campaignPaymentRepository.getDestinationAccount(campaignPayment.campaign.id);
      if (!stripeConnectedAccountId) {
        console.error(`Skipping transfer ${id} - No Stripe Account`);
        continue;
      }
      let queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await this.campaignPaymentRepository.updateFundRelease(
          id,
          {
            status: FundReleaseStatus.IN_PROGRESS,
          },
          queryRunner,
        );
        const transfer = await this.stripeService.createTransfer(Number(amount), currency, stripeConnectedAccountId);
        if (transfer?.id) {
          await this.campaignPaymentRepository.updateFundRelease(
            id,
            {
              amount: transfer.amount,
              transfer_id: transfer.id,
              status: FundReleaseStatus.TRANSFERRED,
              fund_released_at: new Date(),
            },
            queryRunner,
          );
          console.log(`Transfer ${id} completed successfully.`);
        } else {
          await this.campaignPaymentRepository.updateFundRelease(
            id,
            {
              status: FundReleaseStatus.PENDING,
            },
            queryRunner,
          );
          console.error(`Failed to process transfer ${id}`);
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(`Error processing transfer ${id}: ${error.message}`);
        throw new Error(`${error.message}`);
      } finally {
        await queryRunner.release();
      }

      const { influencerId: retrievedInfluencerId, userId } = await this.getInfluencerAndUserIds(campaignPayment.id);
      await this.sendNotification(
        userId,
        retrievedInfluencerId,
        campaignId,
        'Funds has been transffered into your respective account',
        'PAYMENT',
        'brand',
        'influencer',
        'influencer',
      );
    }
  }

  async createPayout(amount: number, currency: string, connectedAccountId: string) {
    return this.stripeService.createPayout(amount, currency, connectedAccountId);
  }

  async getCountryList() {
    return this.stripeService.fetchStripeCountries();
  }

  async requestRefund(campaignId: number, userId: number, user, reason?: string, queryRunner?: QueryRunner) {
    const campaignPayment = await this.campaignPaymentRepository.findOne({
      where: {
        campaign: {
          id: campaignId,
        },
        user: {
          id: userId,
        },
        status: CampaignPaymentStatus.SUCCEEDED,
        is_transferred: false,
      },
    });
    if (!campaignPayment) {
      throw new Error('Payment not found or status is not "SUCCEEDED." Unauthorized access.');
    }
    if (campaignPayment.status !== CampaignPaymentStatus.SUCCEEDED) {
      throw new Error('Refunds can only be requested for successful payments.');
    }
    const fundRelease = await this.campaignPaymentRepository.getFundReleases(campaignPayment?.id);
    if (fundRelease) {
      throw new Error('Payment already released');
    }
    const payload: Partial<Refund> = {
      amount: 0,
      status: RefundStatus.REQUESTED,
      reason: reason,
      campaignPayment: { id: campaignPayment.id } as CampaignPayment,
      user: { id: userId } as User,
    };
    const refundRequest = await this.refundPaymentRepository.addRefundPayment(payload, queryRunner);
    campaignPayment.status = CampaignPaymentStatus.REFUND_REQUESTED;
    await this.campaignPaymentRepository.save(campaignPayment, 'campaignPaymentRepository', CampaignPayment, queryRunner);
    return refundRequest;
  }

  async refundAmount(campaignId: number, queryRunner: QueryRunner) {
    const campaignPayment = await this.campaignPaymentRepository.findOne({
      where: {
        campaign: {
          id: campaignId,
        },
        status: CampaignPaymentStatus.REFUND_REQUESTED,
        is_transferred: false,
      },
      relations: ['user'],
    });

    if (!campaignPayment) {
      throw new Error('Unauthorized access or refund request not submitted.');
    }
    if (campaignPayment.status !== CampaignPaymentStatus.REFUND_REQUESTED) {
      throw new Error(`Refunds can only be requested for ${CampaignPaymentStatus.REFUND_REQUESTED} payments.`);
    }
    const refundPayment = await this.refundPaymentRepository.getRefundInfo({
      campaignPayment: { id: campaignPayment.id },
      amount: 0,
      status: RefundStatus.REQUESTED,
    });
    if (!refundPayment) {
      throw new Error('Refund request was not initiated');
    }
    const fundRelease = await this.campaignPaymentRepository.getFundReleases(campaignPayment?.id);
    if (fundRelease) {
      throw new Error('Payment already released');
    }
    const refundAmount = Math.round(campaignPayment.amount - campaignPayment.amount * 0.2);
    const refund = await this.stripeService.createRefund(campaignPayment.payment_intent_id, refundAmount, refundPayment.reason);
    if (!refund) {
      throw new Error('Failed to refund the payment');
    }

    Object.assign(refundPayment, {
      amount: refund.amount,
      status: RefundStatus.COMPLETED,
      reason: refundPayment.reason,
      transaction_id: refund.id,
    });

    campaignPayment.status = CampaignPaymentStatus.REFUNDED;
    campaignPayment.refunded_amount = refund.amount;
    await this.campaignPaymentRepository.save(campaignPayment, 'campaignPaymentRepository', CampaignPayment, queryRunner);
    await this.refundPaymentRepository.save(refundPayment, 'refundPaymentRepository', Refund, queryRunner);
    const user = campaignPayment.user;
    this.sendRefundEmail(user, refund.amount);
    return refund;
  }

  async sendRefundEmail(user, refundedAmount) {
    const emailSubject = 'UBU Refund Alert';
    refundedAmount = refundedAmount / 100;
    const emailBody = `
        <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
          <div style="text-align: center; padding: 10px 0; background-color: #000;">
            <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
              UBU
            </h1>
          </div>
          <div style="padding: 20px;">
            <h1 style="font-size: 24px; color: #000; text-align: center;">Refund Processed</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Dear ${user.first_name} ${user.last_name},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We want to inform you that your refund request has been successfully processed. The refunded amount of <strong>$${refundedAmount.toFixed(
                2,
              )}</strong> has been credited back to your original payment method.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              If you have any questions or require further assistance, please don't hesitate to contact our support team. We are here to help!
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://ubu.live/support" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Regards,<br>
              UBU Team
            </p>
          </div>
          <div style="text-align: center; padding: 10px; background-color: #f0f0f0;">
            <p style="font-size: 12px; color: #888;">UBU Corporation<br>
            You are receiving this email because you opted in via our website.</p>
            <div style="margin-top: 10px;">
              <a href="https://tiktok.com" style="text-decoration: none; color: #888;">TikTok</a> |
              <a href="https://facebook.com" style="text-decoration: none; color: #888;">Facebook</a> |
              <a href="https://instagram.com" style="text-decoration: none; color: #888;">Instagram</a>
            </div>
          </div>
        </div>
      `;

    const resp = await this.mailgunService.sendEmail(
      // 'ace@ubu.live',
      user.email,
      emailSubject,
      emailBody,
      true,
    );
  }

  async isValidTransaction(campaignId: number, userId?: number) {
    const whereCondition: any = {
      campaign: { id: campaignId },
      status: In([CampaignPaymentStatus.SUCCEEDED, CampaignPaymentStatus.REFUND_REQUESTED]),
      is_transferred: false,
    };

    if (userId) {
      whereCondition.user = { id: userId };
    }
    const campaignPayment = await this.campaignPaymentRepository.getUntransferredCampaignPayment(whereCondition);
    if (!campaignPayment) {
      return {
        isValid: false,
      };
    }
    const fundRelease = await this.campaignPaymentRepository.getFundReleases(campaignPayment?.id);
    if (fundRelease) {
      return {
        isValid: false,
      };
    }
    return {
      isValid: true,
      campaignPayment,
    };
  }

  async getTransactionLogs(data: ICampaignTransactionLogs): Promise<any> {
    const { user, ...filters } = data;
    if (!user?.id) {
      throw new BadRequestException('User ID is required.');
    }

    const userType: 'brandUser' | 'influencerUser' = user.influencer ? 'influencerUser' : 'brandUser';

    try {
      return await this.campaignPaymentRepository.getTransactionLogs({
        userId: user.id,
        userType,
        ...filters,
      });
    } catch (error) {
      console.error('Error in getTransactionLogs:', error);
      throw new InternalServerErrorException('Could not retrieve transaction logs.');
    }
  }

  async getTransactionSummary(user: any): Promise<any> {
    if (!user?.id) {
      throw new BadRequestException('User ID is required.');
    }
    try {
      const userType: 'brand' | 'influencer' = user.influencer ? 'influencer' : 'brand';

      let transactionSummary = {};
      if (userType == 'brand') {
        transactionSummary = await this.campaignPaymentRepository.getBrandTransactionSummary(user.id);
      } else if (userType == 'influencer') {
        transactionSummary = await this.campaignPaymentRepository.getInfluencerTransactionSummary(user.id, user.influencer.id);
      } else {
        throw new BadRequestException('Invalid User');
      }
      return transactionSummary;
    } catch (error) {
      console.error('Error in getTransactionSummary:', error);
      throw new InternalServerErrorException('Could not retrieve transaction Summary.');
    }
  }

  canSendPayment(account: any) {
    const { charges_enabled: chargesEnabled, payouts_enabled: payoutsEnabled, external_accounts: externalAccounts, capabilities, requirements } = account;

    let message = '';
    let status = false;

    const isComplete =
      requirements?.alternatives?.length === 0 &&
      requirements?.current_deadline === null &&
      requirements?.currently_due.length === 0 &&
      requirements?.disabled_reason === null &&
      requirements?.errors?.length === 0 &&
      requirements?.eventually_due?.length === 0 &&
      requirements?.past_due?.length === 0 &&
      requirements?.pending_verification?.length === 0;

    if (!isComplete) {
      message = 'Requirements are incomplete. Please ensure all necessary conditions are met before proceeding.';
      return { status: isComplete, message };
    }

    if (!chargesEnabled) {
      message = 'Charges are not enabled on the account.';
      return { status, message };
    }

    if (!payoutsEnabled) {
      message = 'Payouts are not enabled on the account.';
      return { status, message };
    }

    /*  const hasVerifiedBankAccount = externalAccounts?.data?.some((bank) => bank.status === 'verified');
     if (!hasVerifiedBankAccount)
     {
       message = 'No verified bank account found on the account.';
       return { status, message };
     } */

    if (capabilities.transfers !== 'active') {
      message = 'Transfers capability is not active on the account.';
      return { status, message };
    }

    const noPendingRequirements = !requirements.currently_due?.length && !requirements.past_due?.length;
    if (!noPendingRequirements) {
      message = 'There are pending requirements on the account.';
      return { status, message };
    }

    message = 'Account is fully set up and ready for payment.';
    status = true;
    return { status, message };
  }
}
