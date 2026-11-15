import { User } from '@infrastructure/orm/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

export class StripeService {
  private stripe;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, { apiVersion: '2025-02-24.acacia' });
  }

  async getProducts() {
    const products = await this.stripe.products.list({
      active: true,
    });

    const prices = await this.stripe.prices.list({
      active: true,
    });

    let products_price = products.data.map((product) => {
      let productPrice = {
        product: product,
        price: prices.data.filter((price) => price.product === product.id),
      };
      return productPrice;
    });
    return {
      statusCode: 201,
      data: products_price,
    };
  }

  async createStripeCustomer(req) {
    return this.stripe.customers.create({
      email: req.user.email,
      name: req.user.name,
    });
  }

  async createstripeCheckoutSession(customer, data) {
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer,
      line_items: [
        {
          price: data.price,
          quantity: 1,
        },
      ],
      success_url: data.success_url,
      cancel_url: data.cancel_url,
    });
  }

  async userCheckoutValidations(user) {
    let sub_info;
    if (user?.stripe_customer_id) {
      sub_info = await this.stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: 'active',
      });
    }
    const total_subscriptions = sub_info?.data?.length;

    if (total_subscriptions) {
      const idsWithFalse = sub_info.data.filter((item) => item.cancel_at_period_end === false).map((item) => item.id);

      console.log('idsWithFalse :: ', idsWithFalse);
      // If no false entries, return true, otherwise return the ids
      return idsWithFalse.length === 0 ? true : false;
    }
    return true;
  }

  async invoiceData(invoice_id) {
    return this.stripe.invoices.retrieve(invoice_id);
  }

  async cancelSubscriptions(req, id) {
    const userInfo = await this.userRepository.findOne({
      where: {
        email: req.user.email,
      },
    });

    const customer = userInfo?.stripe_customer_id;

    if (!customer) {
      return {
        statusCode: 402,
        data: 'No Subscription found for this Customer',
      };
    }
    const userSubscriptions = await this.stripe.subscriptions.list({
      customer,
    });

    const check_Validatation = userSubscriptions.data.some((item) => item.id === id);
    if (!check_Validatation) {
      return {
        statusCode: 402,
        data: 'No Subscription found',
      };
    }
    console.log('Id is ::: ', id);
    return this.stripe.subscriptions.update(id, {
      cancel_at_period_end: true,
    });
    // return this.stripe.subscriptions.cancel(
    //   id
    // );
  }
  // -------------------------------

  async getUserSubscription(req) {
    const customer = req.user?.stripe_customer_id;
    if (customer) {
      const userSubscriptions = await this.stripe.subscriptions.list({
        customer,
      });
      return userSubscriptions;
    }
    return {
      statusCode: 402,
      data: 'Not subscribed',
    };
  }

  async createRefund(paymentIntentId: string, amount: number, reason?: string) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount,
        reason: reason ? 'requested_by_customer' : undefined,
        metadata: reason ? { reason } : undefined,
      });
      return refund;
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }

  async UserSubscriptionInfo(data) {
    const sub_info = await this.stripe.subscriptions.list(data);
    if (!sub_info.data.length) {
      return {
        isSubscriptionActive: false,
        data: 'Upgrade your Subscription',
      };
    }
    const product_info = await this.stripe.products.retrieve(sub_info.data[0]?.plan.product);
    return {
      isSubscriptionActive: true,
      data: product_info,
    };
  }

  async getBalanceByPaymentIntentId(payment_intent_id) {
    const paymenetIntet = await this.stripe.paymentIntents.retrieve(payment_intent_id);
    const charge = await this.stripe.charges.retrieve(paymenetIntet.latest_charge);
    const balanceTransaction = await this.stripe.balanceTransactions.retrieve(charge.balance_transaction);

    return {
      paymenetIntet,
      charge,
      balanceTransaction,
    };
  }

  async createCheckoutSession(data, req) {
    const userInfo = { stripe_customer_id: 1 }; //await this.userService.findByEmail(req.user.email)
    const validation = await this.userCheckoutValidations(userInfo);
    if (!validation) {
      return {
        statusCode: 402,
        data: `${req.user.name} has already Subscribed`,
      };
    }
    let customer = userInfo?.stripe_customer_id;
    if (!userInfo?.stripe_customer_id) {
      let createCustomer = await this.stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
      });
      let updateCustomer = await this.userRepository.update(req.user.id, {
        stripe_customer_id: createCustomer.id,
      });
      customer = createCustomer.id;
    }
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customer,
      line_items: [
        {
          price: data.price,
          quantity: 1,
        },
      ],
      success_url: data.success_url,
      cancel_url: data.cancel_url,
    });
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

  // Campaign Payment Work FLow

  async createPaymentIntent(amount: number, currency: string, metadata: Record<string, any>) {
    return this.stripe.paymentIntents.create({
      amount, // Amount in cents
      currency,
      payment_method_types: ['card'],
      metadata,
    });
  }

  async createConnectedAccount(email: string, country: string, first_name: string, last_name: string) {
    return this.stripe.accounts.create({
      type: 'custom',
      email,
      business_type: 'individual',

      country: country,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      individual: {
        first_name: first_name,
        last_name: last_name,
        email: email,
      },
    });
  }

  async updateStripeAccount(
    accountId: string,
    phone: string,
    dobDay: number,
    dobMonth: number,
    dobYear: number,
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
    try {
      const updatedAccount = await this.stripe.accounts.update(accountId, {
        individual: {
          phone: phone,
          id_number: ssn,
          dob: {
            day: dobDay,
            month: dobMonth,
            year: dobYear,
          },
          address: {
            line1: addressLine1,
            city: addressCity,
            state: addressState,
            postal_code: addressPostalCode,
            country: country,
          },
        },
        external_account: {
          object: 'bank_account',
          country: country,
          currency: 'usd',
          routing_number: bankRoutingNumber,
          account_number: bankAccountNumber,
        },
        business_profile: {
          mcc: '5734',
          url: 'https://ubu.live',
        },

        tos_acceptance: {
          date: Math.floor(Date.now() / 1000),
          ip: ipAddress,
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });

      console.log('Stripe account updated with required details:', updatedAccount.id);
      return updatedAccount;
    } catch (error) {
      console.error('Error updating Stripe account:', error.message);
      throw new Error(`Failed to update Stripe account: ${error}`);
    }
  }

  async createTransfer(amount: number, currency: string, destination: string) {
    return this.stripe.transfers.create({
      amount,
      currency,
      destination,
    });
  }

  async retrieveAccount(account_number: string) {
    return this.stripe.accounts.retrieve(account_number);
  }

  async createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
    return this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
  }

  async chargeAdmin(customerId: string, amount: number) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      if (paymentMethods.data.length === 0) {
        throw new Error('No saved card found for this customer.');
      }

      const paymentMethodId = paymentMethods.data[0].id;

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
      });

      return paymentIntent;
    } catch (error) {
      console.log('Error charging admin:', error.message);
      throw new Error(`Stripe charge failed: ${error.message}`);
    }
  }

  async createPayout(amount: number, currency: string, connectedAccountId: string) {
    try {
      // Initiate payout to the connected account's linked bank account
      const payout = await this.stripe.payouts.create(
        {
          amount, // e.g., 1000 (for $10.00; amount is in cents)
          currency, // e.g., 'usd'
        },
        {
          stripeAccount: connectedAccountId, // Connected account ID
        },
      );

      return payout;
    } catch (error) {
      console.error('Error creating payout:', error.message);
      throw error;
    }
  }

  async fetchStripeCountries() {
    try {
      return this.stripe.countrySpecs.retrieve('US');
      // console.log("COuntry List is ::: ", countrySpecs)
      // console.log('Supported Countries:', countrySpecs.data.map(spec => spec.id));
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
}
