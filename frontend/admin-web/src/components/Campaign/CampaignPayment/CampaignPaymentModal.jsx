import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useCreatePaymentIntentMutation } from "@src/store/api/campaignPaymentApi";

import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import Stepper from "@src/components/Common/Widgets/Stepper/Stepper";

import CustomModal from "@src/components/Modals/CustomModal";

import PaymentForm from "@src/components/Campaign/CampaignPayment/PaymentForm";
import ReviewDetails from "@src/components/Campaign/CampaignPayment/ReviewDetails";
import { STRIPE_FLAT_FEE, STRIPE_PERCENTAGE_VALUE } from "@src/utils/constant";
import { message } from "antd";
import { roundToTwoDecimalPlaces } from "@src/utils/helpers";

const stripePublicKey = import.meta.env.VITE_FRONTEND_STRIPE_PUBLIC_KEY;
const stripePromise = loadStripe(stripePublicKey);

const CampaignPaymentModal = ({
  isOpen,
  onConfirm,
  onCancel,
  amount,
  campaignId,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [
    createPaymentIntent,
    { isLoading, isSuccess, isError, data: { data: paymentIntentData } = {} },
  ] = useCreatePaymentIntentMutation();

  const { netAmount, stripeFee, totalAmount, totalAmountInCents } =
    useMemo(() => {
      const netAmount = +roundToTwoDecimalPlaces(amount);
      const stripeFlatFeeInDolars = STRIPE_FLAT_FEE / 100;
      const numerator = netAmount + stripeFlatFeeInDolars;
      const denominator = 1 - STRIPE_PERCENTAGE_VALUE;
      const totalAmount = +roundToTwoDecimalPlaces(numerator / denominator);
      const totalAmountInCents = Math.floor(totalAmount * 100);
      const stripeFee = totalAmount * STRIPE_PERCENTAGE_VALUE;

      return { netAmount, stripeFee, totalAmount, totalAmountInCents };
    }, [amount]);

  const handleCreatePaymentIntent = () => {
    createPaymentIntent({
      amount: totalAmountInCents,
      currency: "usd",
      campaign_id: campaignId,
      metadata: {
        campaign_id: campaignId,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) setCurrentStep(1);
  }, [isSuccess]);

  useEffect(() => {
    if (isError)
      message.error(
        "We couldn't initiate your payment. Please try again later or contact support if the issue persists."
      );
  }, [isError]);

  const clientSecret = paymentIntentData?.paymentIntent?.client_secret;

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  return (
    <CustomModal
      title={
        <Heading className="tw-font-manrope tw-font-bold" level={2}>
          {currentStep === 0 ? "Review Details" : "Card Details"}
        </Heading>
      }
      width="672px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-justify-end">
          {currentStep === 0 ? (
            <Button
              onClick={handleCreatePaymentIntent}
              loading={isLoading}
              disabled={isLoading}
            >
              Confirm and Proceed
            </Button>
          ) : null}
        </div>
      }
    >
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap",
            },
          ],
        }}
      >
        <Stepper
          size="small"
          className="tw-w-3/4 tw-mx-auto"
          activeStep={currentStep}
          items={[
            {
              title: "Review Details",
            },
            {
              title: "Card Details",
            },
          ]}
        />
        <div className="tw-mt-5">
          {currentStep === 0 && (
            <ReviewDetails
              netAmount={netAmount}
              stripeFee={stripeFee}
              totalAmount={totalAmount}
            />
          )}
          {currentStep === 1 && (
            <PaymentForm
              clientSecret={clientSecret}
              onPaymentConfrm={onConfirm}
              onBack={handleBack}
            />
          )}
        </div>
      </Elements>
    </CustomModal>
  );
};

CampaignPaymentModal.propTypes = {
  isOpen: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default CampaignPaymentModal;
