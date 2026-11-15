import React from "react";
import CustomModal from "../Modals/CustomModal";
import PropTypes from "prop-types";
import { Heading } from "../Common/Typography";

const RequiredFieldsModal = ({ isOpen, onCancel, accountStatusMessage }) => {
  return (
    <CustomModal
      title={<Heading level={2}>Account Verification</Heading>}
      width="736px"
      isOpen={isOpen}
      className="!tw-h-auto tw-font-manrope"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={null}
    >
      <div className="tw-mt-4 tw-font-manrope tw-space-y-6">
        <Heading level={5} className="tw-font-bold">
          Please provide your bank account details to receive payments for your
          collaborations and affiliate earnings.
        </Heading>
        <div className="tw-overflow-auto tw-custom-scrollbar tw-max-h-[500px]">
          {accountStatusMessage}
        </div>
      </div>
    </CustomModal>
  );
};

RequiredFieldsModal.propTypes = {
  isOpen: PropTypes.func,
  onCancel: PropTypes.func,
  accountStatusMessage: PropTypes.string,
};

export default RequiredFieldsModal;
