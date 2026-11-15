import React, { memo } from "react";
import { Button } from "../Common/Widgets";
import { Heading, Paragraph } from "../Common/Typography";
import PropTypes from "prop-types";
import CustomModal from "./CustomModal";
import WarningIcon from "@src/assets/icons/WarningIcon";
import SuccessTickIcon from "@src/assets/icons/SuccessTickIcon";
import { useSubscription } from "../Providers/SubscriptionsProvider";
import { getFormattedDate } from "@src/utils/helpers";

const SubscriptionCancelSuccessModal = ({ isOpen, onCancel }) => {
  const { activeSubscription } = useSubscription();

  return (
    <CustomModal
      title={null}
      width="672px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={null}
    >
      <div className="tw-flex tw-justify-center">
        <SuccessTickIcon />
      </div>
      <div className="tw-text-center tw-mt-6">
        <Heading level={2} className="tw-font-semibold">
          Your Subscription Has Been Canceled
        </Heading>
        <Paragraph className="text-base tw-text-black-heading tw-mt-3">
          We&apos;re sorry to see you go! Your subscription has been
          successfully canceled and will remain active until{" "}
          {getFormattedDate(
            activeSubscription?.subs_end_date ?? "",
            "MMMM D, YYYY"
          )}
          . If you change your mind, you can reactivate your subscription
          anytime. If you have any questions or need further assistance, please
          contact our support team at support@ubu.com.
        </Paragraph>
      </div>
    </CustomModal>
  );
};

SubscriptionCancelSuccessModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
};
export default memo(SubscriptionCancelSuccessModal);
