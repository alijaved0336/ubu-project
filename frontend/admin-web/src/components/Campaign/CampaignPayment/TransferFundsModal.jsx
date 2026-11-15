import { memo } from "react";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { useReleaseFundsMutation } from "@src/store/api/campaignPaymentApi";
import { message } from "antd";
import PropTypes from "prop-types";
import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";

const TransferFundsModal = ({ isOpen, onCancel, onConfirm, campaignId }) => {
  const [releaseFunds, { isLoading }] = useReleaseFundsMutation();

  const handleReleasePayment = async () => {
    try {
      const { data } = await releaseFunds({ campaign_id: campaignId }).unwrap();
      console.log(data);
      onConfirm && onConfirm("Funds has been released successfully");
    } catch (error) {
      message.error(error?.message || "Faled to release funds");
      console.log(error?.message);
      console.log(error);
    }
  };

  return (
    <CustomModal
      title={null}
      width="500px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-items-center tw-gap-3 tw-justify-center">
          <Button
            className="tw-w-full"
            type="secondary"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleReleasePayment}
            loading={isLoading}
            disabled={isLoading}
          >
            Proceed
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope tw-text-center">
        <WarningIconWithShadow width="54" height="54" className="tw-mx-auto" />

        <Heading level={5} className="tw-font-bold">
          Are you sure you want to transfer the funds for this campaign?
        </Heading>
      </div>
    </CustomModal>
  );
};

TransferFundsModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(TransferFundsModal);
