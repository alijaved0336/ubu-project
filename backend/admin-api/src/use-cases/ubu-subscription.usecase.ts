import { StripeService } from '@infrastructure/services/stripe/stripe-service.service';
import { UserRepository } from '@infrastructure/orm/reposiories/user.repository';
import { UBUSubscriptionRepository } from '@infrastructure/orm/reposiories/ubu-subscription.repository';
const _ = require('lodash');

export class UbuSubscriptionUsecase {
  constructor(
    private ubuSubscriptionRepository: UBUSubscriptionRepository,
    private stripeService: StripeService,
    private userRepository: UserRepository,
  ) {}

  async getProducts() {
    return this.stripeService.getProducts();
  }

  async createCheckoutSession(data, req) {
    const userInfo = await this.userRepository.findUserByEmail(req.user.email);
    const validation = await this.stripeService.userCheckoutValidations(userInfo);
    if (!validation) {
      return {
        statusCode: 402,
        data: `${req.user.email} has already Subscribed`,
      };
    }
    let customer = userInfo?.stripe_customer_id;
    if (!userInfo?.stripe_customer_id) {
      let createCustomer = await this.stripeService.createStripeCustomer(req);
      let updateCustomer = await this.userRepository.update(req.user.id, {
        stripe_customer_id: createCustomer.id,
      });
      customer = createCustomer.id;
    }
    const session = await this.stripeService.createstripeCheckoutSession(customer, data);
    if (!req.user?.stripe_customer_id) {
      await this.userRepository.update(req.user.id, {
        stripe_customer_id: session.customer,
      });
    }
    return {
      statusCode: 201,
      data: session.url,
    };
  }

  async getInvoice(user_id) {
    const subscriptionInfo = await this.ubuSubscriptionRepository.getUserSubscriptionInfo(user_id);
    const invoice_id = subscriptionInfo?.stripe_invoice_id;
    return this.stripeService.invoiceData(invoice_id);
  }

  async cancelSubscriptions(req, id) {
    return this.stripeService.cancelSubscriptions(req, id);
  }
}
