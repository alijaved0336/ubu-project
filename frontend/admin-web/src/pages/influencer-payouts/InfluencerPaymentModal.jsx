import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { message } from "antd";
import ReviewDetailsInfPayout from "./ReviewDetailsInfPayout";
import { useCreatePayoutMutation } from "@src/store/api/influencerPaymentsApi";
import { showNotification } from "@src/utils/showNotification";
import { data } from "autoprefixer";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
const InfluencerPaymentModal = ({
  isOpen,
  onCancel,
  monthRecords,
  connectedAccountId,
  influencerId,
  onConfirm,
}) => {
  const [totalAmountInDollars, setTotalAmountInDollars] = useState(0);
  const [payoutMonth, setPayoutMonth] = useState();

  const [
    createPayout,
    {
      isLoading,
      isSuccess,
      isError,
      error,
      data: { data: paymentIntentData } = {},
    },
  ] = useCreatePayoutMutation();

  const handleCreatePaymentIntent = async () => {
    try {
      await createPayout({
        amount: Math.floor(totalAmountInDollars * 100),
        currency: "usd",
        influencer_user_id: Number(influencerId),
        month: payoutMonth,
        connectedAccountId,
      }).unwrap();

      onCancel();
      showNotification({
        notificationType: "success",
        message: "Success",
        description: "payment initated successfully",
        placement: "topRight",
      });
    } catch (error) {
      showNotification({
        notificationType: "error",
        message: "Failed to transfer funds",
        description: error?.message || FALLBACK_ERROR_MESSAGE,
        placement: "topRight",
      });
    }
  };

  return (
    <CustomModal
      title={
        <Heading level={2} className="tw-font-manrope tw-font-bold">
          Review Details
        </Heading>
      }
      width="672px"
      isOpen={isOpen}
      className="!tw-h-auto"
      centered
      onCancel={onCancel}
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-justify-end tw-gap-2">
          <Button
            onClick={handleCreatePaymentIntent}
            loading={isLoading}
            disabled={isLoading || totalAmountInDollars <= 0}
          >
            Confirm and Proceed
          </Button>
        </div>
      }
    >
      <div className="tw-mt-5">
        <ReviewDetailsInfPayout
          totalAmount={totalAmountInDollars}
          setTotalAmount={setTotalAmountInDollars}
          setPayoutMonth={setPayoutMonth}
          monthRecords={monthRecords}
        />
      </div>
    </CustomModal>
  );
};

InfluencerPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  monthRecords: PropTypes.array,
  connectedAccountId: PropTypes.string,
  influencerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default InfluencerPaymentModal;
