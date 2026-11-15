import SuccessTickIcon from "@src/assets/icons/SuccessTickIcon";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import CustomModal from "@src/components/Modals/CustomModal";
import PropTypes from "prop-types";
import React from "react";

const CampaignPaymentSuccessModal = ({ isOpen, onCancel }) => {
  return (
    <CustomModal
      title={null}
      width="500px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={null}
    >
      <div className="tw-space-y-6 tw-font-manrope tw-text-center">
        <SuccessTickIcon color="green" className="tw-mx-auto" />
        <Heading level={5} className="tw-font-semibold">
          Success!
        </Heading>
        <Paragraph>Your payment has been successfully processed.</Paragraph>
      </div>
    </CustomModal>
  );
};

CampaignPaymentSuccessModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
};

export default CampaignPaymentSuccessModal;
