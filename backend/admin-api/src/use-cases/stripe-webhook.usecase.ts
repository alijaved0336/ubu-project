import { CampaignPaymentStatus } from '@infrastructure/orm/entities/campaign-payment.entity';
import { CampaignPaymentRepository } from '@infrastructure/orm/reposiories/campaign-payment.repository';
import { CampaignRepository } from '@infrastructure/orm/reposiories/campaign.repository';
import { NotificationRepository } from '@infrastructure/orm/reposiories/notification.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { MailGunService } from '@infrastructure/services/mailgun/mailgun.service';
import { CampaignService } from '@infrastructure/sockets/campaign.service';
import { NotificationService } from '@infrastructure/sockets/notification.service';
import { WebSocketProviderService } from '@infrastructure/sockets/web-socket-provider';
import { CampaignStatus } from '@infrastructure/utils/constant';
import Stripe from 'stripe';

export class StripeWebhookUsecase {
  private stripe: Stripe;
  private endpointSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly ubuSubscriptionRepository: UBUSubscriptionRepository,
    private readonly campaignPaymentRepository: CampaignPaymentRepository,
    private readonly campaignRepository: CampaignRepository,
    private mailgunService: MailGunService,
    private readonly webSocketProvider: WebSocketProviderService,
    private readonly notificationRepo: NotificationRepository,
    private readonly campaignService: CampaignService,
    private readonly notificationService: NotificationService,
  ) {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, { apiVersion: '2025-02-24.acacia' });
    this.endpointSecret = `${process.env.STRIPE_ENPOINT_SECRET}`;
  }

  async webhook(rawBody: Buffer, signature: string, response) {
    let event: Stripe.Event;

    try {
      // Ensure rawBody is a Buffer
      if (!(rawBody instanceof Buffer)) {
        throw new Error('Expected rawBody to be a Buffer');
      }
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.endpointSecret);
    } catch (err) {
      console.log('Error occurred:', err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log('EVENT TYPE ::', event.type);

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.deleted':
        console.log('Cancel Subscription');
        const customer_subscription_deleted = event.data.object;
        const getUser = await this.userRepository.findUserByCondition({
          stripe_customer_id: customer_subscription_deleted.customer,
        });

        break;

      case 'customer.subscription.updated':
        console.log('updated Subscription');
        const customer_subscription_updated = event.data.object;
        const subscription_Update_payload = {
          cancel_at_period_end: customer_subscription_updated.cancel_at_period_end,
        };
        const condition = { stripe_subscription_id: customer_subscription_updated.id };
        await this.ubuSubscriptionRepository.updateSubscription(condition, subscription_Update_payload);
        break;

      case 'invoice.payment_succeeded':
        console.log('invoice.payment_succeeded');
        const invoicePaymentSucceeded = event.data.object;
        const userInfo = await this.userRepository.findUserByCondition({
          email: invoicePaymentSucceeded.customer_email,
          stripe_customer_id: invoicePaymentSucceeded.customer,
        });
        let subId = invoicePaymentSucceeded.subscription;
        const subscription = await this.stripe.subscriptions.retrieve(`${subId}`);
        const productId = subscription['plan'].product;
        const product = await this.stripe.products.retrieve(`${productId}`);
        const subscription_payload = {
          user: userInfo?.id,
          stripe_subscription_id: subId,
          stripe_invoice_id: invoicePaymentSucceeded.id,
          subs_start_date: subscription.current_period_start,
          subs_end_date: subscription.current_period_end,
          plan_type: product.metadata.plan_type,
          price_id: subscription['plan'].id,
          price: subscription['plan'].amount,
          product_id: productId,
          interval: subscription['plan'].interval,
        };
        await this.ubuSubscriptionRepository.addSubscriptionInfo(subscription_payload);
        break;

      case 'account.updated':
        const account = event.data.object as Stripe.Account;
        if (account.capabilities?.card_payments === 'active' && account.capabilities?.transfers === 'active') {
          console.log('Received account.updated event');
          //insert socket trigger here
        }
        break;
      case 'invoice.paid':
        console.log('invoice.paid');
        const invoice_paid = event.data.object;
        // console.log('invoice_paid:', invoice_paid);
        break;

      case 'payment_intent.created':
        console.log('payment_intent.created');
        const payment_intent_created = event.data.object;
        console.log('payment_intent.created:', payment_intent_created);
        break;

      case 'payment_intent.succeeded':
        console.log('payment_intent.succeeded');
        const payment_intent_succeeded = event.data.object;
        const campaign_payment = await this.campaignPaymentRepository.updateCampaginPayment(payment_intent_succeeded.id, {
          status: CampaignPaymentStatus.SUCCEEDED,
        });
        if (campaign_payment) {
          await this.campaignRepository.update(campaign_payment?.campaign?.id, { status: CampaignStatus.PAYMENT_HELD });
          this.campaignService.updateCampaignStatusTrigger({ campaign_id: campaign_payment?.campaign?.id });

          const userInfoByPaymentId = await this.campaignPaymentRepository.findUserByPaymentIntentId(payment_intent_succeeded.id);
          this.sendPaymentSuccessEmail(userInfoByPaymentId?.user, payment_intent_succeeded.amount);
          const notificationData = {
            sender: Number(userInfoByPaymentId?.user.id),
            recipient: Number(userInfoByPaymentId?.campaign?.influencer?.user.id),
            content: 'Payment Held',
            type: 'PAYMENT',
            senderType: 'brand',
            receiverType: 'influencer',
            receiverCheck: 'influencer',
            campaign_id: campaign_payment?.campaign?.id,
          };
          this.notificationService.handlePushNotification(notificationData);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed for PaymentIntent: ${failedPaymentIntent.id}`);
        break;

      case 'payout.created':
        const payout_created = event.data.object as Stripe.Payout;
        console.error(`Payout created: ${payout_created.id}`);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response.send();
  }

  async sendPaymentSuccessEmail(user, paymentAmount) {
    const emailSubject = 'UBU Payment Successful';
    paymentAmount = paymentAmount / 100; // Convert amount to dollars if necessary

    const emailBody = `
        <div style="background-color: #fff; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 10px;">
          <div style="text-align: center; padding: 10px 0; background-color: #000;">
            <h1 style="color: white; font-family: 'Classy Vogue'; font-size: 36px; margin: 0;">
              UBU
            </h1>
          </div>
          <div style="padding: 20px;">
            <h1 style="font-size: 24px; color: #000; text-align: center;">Payment Successful</h1>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Dear ${user.first_name} ${user.last_name},
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              We are excited to inform you that your payment of <strong>$${paymentAmount.toFixed(
                2,
              )}</strong> has been successfully processed on the UBU platform.
            </p>
            <p style="font-size: 16px; line-height: 1.5; color: #333;">
              Your payment has been securely received, and we are thrilled to have you as part of the UBU community. If you need any assistance, please feel free to contact our support team.
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

    const resp = await this.mailgunService.sendEmail(user.email, emailSubject, emailBody, true);

    return resp;
  }
}
