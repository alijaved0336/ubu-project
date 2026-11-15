import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
import { useCreateConnectedAccountMutation } from "@src/store/api/campaignPaymentApi";
import { connectedAccountStatuses } from "@src/utils/constant";
import PropTypes from "prop-types";

const AccountCompletionModal = ({ isOpen, onCancel, message, onConfirm }) => {
  const { email, default_currency, status } = useConnectedAccount();

  const [createConnectedAccount, { isLoading }] =
    useCreateConnectedAccountMutation();

  const handleCompleteAccount = async () => {
    if (status === connectedAccountStatuses.IN_PROGRESS) {
      message.success(
        "Verification from stripe is in progress, your account status will be updated soon."
      );
    } else if (status === connectedAccountStatuses.PENDING) {
      const payload = {
        email: email,
        country: default_currency,
        returnUrl: import.meta.env.VITE_FRONTEND_CONNECTED_ACCOUNT_RETURN_URL,
        refreshUrl: import.meta.env.VITE_FRONTEND_CONNECTED_ACCOUNT_REFRESH_URL,
      };
      try {
        const response = await createConnectedAccount(payload).unwrap();
        const connectedAccountData = response?.data;
        if (response.message == "Connected account created successfully.") {
          message.success(
            "Verification from stripe is in progress, your account status will be updated soon."
          );
        }
        onConfirm && onConfirm();
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <CustomModal
      title={<Heading level={2}>Account Verification</Heading>}
      width="736px"
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
            Skip for now
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleCompleteAccount}
            loading={isLoading}
          >
            Add Account Details
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope ">
        <Heading level={5} className="tw-font-bold">
          Please provide your bank account details to receive payments for your
          collaborations and affiliate earnings.
        </Heading>
        <div className="tw-max-h-[500px] tw-overflow-auto tw-custom-scrollbar">
          {message}
        </div>
      </div>
    </CustomModal>
  );
};

AccountCompletionModal.propTypes = {
  isOpen: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  message: PropTypes.string,
};

export default AccountCompletionModal;
