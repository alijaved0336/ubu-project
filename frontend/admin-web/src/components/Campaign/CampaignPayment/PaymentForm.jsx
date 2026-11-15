import React, { useState } from "react";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@src/components/Common/Widgets";

import { Skeleton } from "antd";
import cn from "@src/cn";
import PropTypes from "prop-types";
import { Paragraph } from "@src/components/Common/Typography";

const inputStyle = {
  base: {
    fontFamily: "Manrope, sans-serif", // Apply the Manrope font
    fontSize: "16px", // You can adjust the font size as needed

    "::placeholder": {
      color: "#aab7c4", // You can customize the placeholder color if you wish
      fontFamily: "Manrope, sans-serif", // Ensure the placeholder uses Manrope font
    },
  },
};

const classes = {
  base: "tw-block tw-w-full tw-p-[10px] tw-border-2 tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-font-manrope",
  focus: "!tw-border-black-60",
  invalid: "!tw-border-red-500",
};

const PaymentForm = ({ clientSecret, onBack, onPaymentConfrm }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [elementsReady, setElementsReady] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleElementReady = (elementName) => {
    setElementsReady((prevState) => ({ ...prevState, [elementName]: true }));
  };

  const handleElementChange = (elementName, event) => {
    setErrors((prevState) => ({
      ...prevState,
      [elementName]: event.error ? event.error.message : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      setMessage("Stripe has not loaded or payment intent is missing.");
      setLoading(false);
      return;
    }

    // const cardElement = elements.getElement(CardElement);
    const cardNumberElement = elements.getElement(CardNumberElement);
    // const cardExpiryElement = elements.getElement(CardExpiryElement);
    // const cardCvcElement = elements.getElement(CardCvcElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
        },
      }
    );

    setLoading(false);

    if (!paymentIntent && error?.type === "validation_error") {
      return;
    }

    if (error && error.type !== "validation_error") {
      console.error("Payment error:", error);
      console.log(error);
      setMessage(error.message || "Payment failed");
    } else if (paymentIntent.status === "succeeded") {
      onPaymentConfrm();
      // setMessage("Payment successful!");
    } else {
      setMessage("Payment processing...");
    }
  };

  const isCardNumberElementReady = stripe && elementsReady.cardNumber;
  const isCardCvcElementReady = stripe && elementsReady.cardCvc;
  const isCardExpiryElementReady = stripe && elementsReady.cardExpiry;

  const areFieldsReady =
    isCardNumberElementReady &&
    isCardCvcElementReady &&
    isCardExpiryElementReady;

  return (
    <form className="tw-space-y-6 tw-font-manrope">
      {message && (
        <div
          className={`tw-p-4 tw-rounded-lg ${
            message.includes("successful")
              ? "tw-bg-green-50 tw-text-green-700"
              : "tw-bg-red-50 tw-text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <div className="tw-space-y-4">
        <div className="tw-space-y-2">
          <label className=" tw-block tw-text-sm tw-font-medium tw-text-gray-700 ">
            Card Number
          </label>
          <div className="tw-mt-1">
            {!isCardNumberElementReady && (
              <Skeleton.Input
                active
                size="large"
                style={{ width: "100%" }}
                block
              />
            )}

            <CardNumberElement
              options={{
                classes: {
                  base: cn(classes.base, {
                    "tw-hidden": !isCardNumberElementReady,
                  }),
                  focus: classes.focus,
                  invalid: classes.invalid,
                },
                style: inputStyle,
                showIcon: true,
              }}
              onReady={() => handleElementReady("cardNumber")}
              onChange={(event) => handleElementChange("cardNumber", event)}
            />
            {errors.cardNumber && (
              <div className="tw-text-red-500 tw-mt-2">{errors.cardNumber}</div>
            )}
          </div>
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-4">
          <div className="tw-space-y-2">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              Expiry Date
            </label>
            <div className="tw-mt-1">
              {!isCardExpiryElementReady && (
                <Skeleton.Input
                  active
                  size="large"
                  style={{ width: "100%" }}
                  block
                />
              )}
              <CardExpiryElement
                options={{
                  classes: {
                    base: cn(classes.base, {
                      "tw-hidden": !isCardExpiryElementReady,
                    }),
                    focus: classes.focus,
                    invalid: classes.invalid,
                  },
                  style: inputStyle,
                }}
                onReady={() => handleElementReady("cardExpiry")}
                onChange={(event) => handleElementChange("cardExpiry", event)}
              />
              {errors.cardExpiry && (
                <div className="tw-text-red-500 tw-mt-2">
                  {errors.cardExpiry}
                </div>
              )}
            </div>
          </div>

          <div className="tw-space-y-2">
            <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
              CVC
            </label>
            <div className="tw-mt-1">
              {!isCardCvcElementReady && (
                <Skeleton.Input
                  active
                  size="large"
                  style={{ width: "100%" }}
                  block
                />
              )}
              <CardCvcElement
                options={{
                  classes: {
                    base: cn(classes.base, {
                      "tw-hidden": !isCardCvcElementReady,
                    }),
                    focus: classes.focus,
                    invalid: classes.invalid,
                  },
                  style: inputStyle,
                }}
                onReady={() => handleElementReady("cardCvc")}
                onChange={(event) => handleElementChange("cardCvc", event)}
              />
              {errors.cardCvc && (
                <div className="tw-text-red-500 tw-mt-2">{errors.cardCvc}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="tw-mt-2 tw-text-sm tw-flex tw-gap-2 tw-items-center">
        <span className="tw-font-extrabold">Note:</span>
        <Paragraph className="tw-text-gray-500">
          Your payment information is processed securely by Stripe.
        </Paragraph>
      </div>

      <div className="tw-mt-6 tw-flex tw-justify-center tw-gap-3">
        <Button
          type="secondary"
          variant="outlined"
          className="tw-w-full"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          loading={loading}
          type="primary"
          className="tw-w-full"
          disabled={!areFieldsReady || loading}
          onClick={handleSubmit}
        >
          Pay Now
        </Button>
      </div>
    </form>
  );
};

PaymentForm.propTypes = {
  clientSecret: PropTypes.string,
  onBack: PropTypes.func,
  onPaymentConfrm: PropTypes.func,
};

export default PaymentForm;
