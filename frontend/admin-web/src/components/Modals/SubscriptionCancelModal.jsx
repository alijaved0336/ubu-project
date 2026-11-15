import React, { memo } from "react";
import { Button } from "../Common/Widgets";
import { Heading, Paragraph } from "../Common/Typography";
import PropTypes from "prop-types";
import CustomModal from "./CustomModal";
import WarningIcon from "@src/assets/icons/WarningIcon";

const SubscriptionCancelModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isCancelling,
}) => {
  return (
    <CustomModal
      title={
        <>
          <WarningIcon width="54" height="54" />
          <Heading level={2}>Cancel Subscription</Heading>
        </>
      }
      width="672px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-justify-center tw-gap-5 tw-mt-6 tw-items-center">
          <Button
            type="primary"
            variant="outlined"
            className="tw-font-medium tw-w-full tw-py-6 tw-px-4 tw-flex tw-justify-center tw-items-center"
            onClick={onCancel}
          >
            Keep Subscription
          </Button>
          <Button
            type="primary"
            className=" tw-font-medium tw-py-6 tw-w-full tw-px-4 tw-justify-center tw-items-center"
            loading={isCancelling}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <Heading level={4}>
        Are you sure you want to cancel your subscription?
      </Heading>
      <Paragraph className="tw-text-black-heading tw-mt-3 tw-text-xl">
        Canceling your subscription means you’ll lose access to exclusive
        features and benefits. Your subscription will remain active until the
        end of the current billing cycle. Do you want to proceed?
      </Paragraph>
    </CustomModal>
  );
};

SubscriptionCancelModal.propTypes = {
  isOpen: PropTypes.bool,
  isCancelling: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

export default memo(SubscriptionCancelModal);
