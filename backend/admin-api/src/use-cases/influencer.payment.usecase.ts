import { InfluencerPaymentStatus } from '@infrastructure/orm/entities/influencer-payment.entity';
import { InfluencerPaymentRepository } from '@infrastructure/orm/reposiories/influencer-payment.repository';
import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import { HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CURRENCY } from 'constants/currency';
import { DataSource } from 'typeorm';

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

export class InfluencerPaymentUseCase {
  constructor(
    @InjectRepository(InfluencerPaymentRepository)
    private readonly influencerPaymentRepo: InfluencerPaymentRepository,
    private stripeService: StripeService,
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  async transferFunds(user_id: number, amount: number, currency: string, connectedAccountId: string, month: string, influencer_user_id: number) {
    let queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const isValidTransaction = await this.isValidTransaction(influencer_user_id, month);
      if (!connectedAccountId) {
        throw new HttpException('Influencer needs to add their account', HttpStatus.BAD_REQUEST);
      }
      if (!amount) {
        throw new HttpException('Amount should be greater than zero', HttpStatus.BAD_REQUEST);
      }

      const accountInfo = await this.stripeService.retrieveAccount(connectedAccountId);
      const canSend = this.canSendPayment(accountInfo);
      if (!canSend.status) {
        throw new HttpException(canSend.message, HttpStatus.BAD_REQUEST);
      }
      const transfer = await this.stripeService.createTransfer(Number(amount), currency, connectedAccountId);
      let influencerPaymentRelease;
      if (transfer?.id) {
        const payload = {
          amount: amount,
          transfer_id: transfer?.id,
          status: InfluencerPaymentStatus.SUCCEEDED,
          currency: CURRENCY.USD,
          month: month,
          user: { id: influencer_user_id },
        };
        influencerPaymentRelease = await this.influencerPaymentRepo.create(payload);
        console.log(`Transfer ${transfer?.id} completed successfully.`);
      }

      // await this.sendNotification(user_id, influencer_id, 'Brand has Released the Payment', 'PAYMENT', 'brand', 'influencer', 'influencer');
      await queryRunner.commitTransaction();
      return {
        data: influencerPaymentRelease,
        message: 'Transferred scheduled successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error.message);
      throw new Error(`${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async isValidTransaction(user_id: number, month: string) {
    const exists = await this.influencerPaymentRepo.existsByUserIdAndMonth(user_id, month);
    if (exists) {
      throw new UnprocessableEntityException('Payment already exists for this user and month');
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

  async findAll(id) {
    const payments = await this.influencerPaymentRepo.findAll(id);

    const transformed = payments.map((payment) => {
      const amount = payment.amount.toString();
      return {
        id: payment.id,
        transfer_id: payment.transfer_id,
        status: payment.status,
        amount: (parseFloat(amount) / 100).toFixed(2), // still a string
        currency: payment.currency,
        month: payment.month,
        created_at: payment.created_at,
        updated_at: payment.updated_at,
      };
    });

    return transformed;
  }
}
