import { useEffect, useState } from "react";
import AccountDetailsSkeleton from "./AccountDetailsSkeleton";
import { UBUIcon } from "@src/assets/icons";
import { Paragraph } from "../Common/Typography";
import { Button } from "../Common/Widgets";
import AccountCreationModal from "../Campaign/CampaignPayment/AccountCreationModal";
import AccountDetailsModal from "../Campaign/CampaignPayment/AccountDetailsModal";
import { connectedAccountStatuses } from "@src/utils/constant";
import { useConnectedAccount } from "../Providers/ConnectedAccountProvider";
import Error from "../Common/Typography/Error";
import { useCreateConnectedAccountMutation } from "@src/store/api/campaignPaymentApi";
import Status from "../Common/Typography/Status";
import { ReloadOutlined } from "@ant-design/icons";
import { Tooltip, Typography } from "antd";
import RequiredFieldsModal from "./RequiredFieldsModal";
const { Text } = Typography;

const AccountDetails = () => {
  const [isOpenAccountCreationModal, setIsOpenAccountCreationModal] =
    useState(false);

  const [isOpenAccountUpdationModal, setIsOpenAccountUpdationModal] =
    useState(false);

  const [isOpenRequiredFieldsModal, setIsOpenRequiredFieldsModal] =
    useState(false);

  const [
    createConnectedAccount,
    { isLoading, isSuccess, data: { data: connectedAccountData } = {} },
  ] = useCreateConnectedAccountMutation();

  const {
    isComplete,
    lastFourDigits,
    bank_name,
    account_holder_name,
    email,
    charges_enabled,
    payouts_enabled,
    default_currency,
    routing_number,
    bankStatus,
    status,
    hasNoAccount,
    isLoadingConnectedAccountDetails,
    connectedAccountDetailsHasError,
    connectedAccountDetailsError,
    accountStatusMessage,
    onRefetch,
  } = useConnectedAccount();

  const handleCompleteAccount = () => {
    if (status === connectedAccountStatuses.IN_PROGRESS) {
      setIsOpenAccountUpdationModal(true);
    } else if (status === connectedAccountStatuses.PENDING) {
      setIsOpenAccountUpdationModal(true);
    } else {
      setIsOpenAccountCreationModal(true);
    }
  };

  useEffect(() => {
    if (isSuccess && connectedAccountData) {
      console.log("completed");
    }
  }, [connectedAccountData, isSuccess]);

  if (isLoadingConnectedAccountDetails) return <AccountDetailsSkeleton />;

  if (connectedAccountDetailsHasError)
    return (
      <Error
        message={connectedAccountDetailsError?.message}
        className="tw-center-element"
      />
    );

  return (
    <div className="tw-min-h-[calc(100vh-178px)] tw-flex tw-flex-col tw-justify-center tw-space-y-4 tw-mt-6 ">
      {isOpenAccountCreationModal && (
        <AccountCreationModal
          isOpen={isOpenAccountCreationModal}
          onCancel={() => setIsOpenAccountCreationModal(false)}
          onConfirm={() => setIsOpenAccountCreationModal(false)}
        />
      )}

      {isOpenAccountUpdationModal && (
        <AccountDetailsModal
          isOpen={isOpenAccountUpdationModal}
          onCancel={() => setIsOpenAccountUpdationModal(false)}
          onConfirm={() => setIsOpenAccountUpdationModal(false)}
        />
      )}

      {isOpenRequiredFieldsModal && (
        <RequiredFieldsModal
          accountStatusMessage={accountStatusMessage}
          isOpen={isOpenRequiredFieldsModal}
          onCancel={() => setIsOpenRequiredFieldsModal(false)}
        />
      )}

      {status !== connectedAccountStatuses.IN_ACTIVE && (
        <div className="tw-ticket-edge  tw-min-h-[315px] tw-w-[30.375rem] tw-max-w-full tw-mx-auto tw-rounded-xl tw-border tw-shadow-card tw-p-4 tw-flex tw-flex-col tw-justify-between">
          <div className="tw-bg-black tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-absolute tw-top-0 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
            <UBUIcon width="40" height="20" />
          </div>

          {!isComplete && (
            <Tooltip title="Refresh">
              <ReloadOutlined
                className="tw-cursor-pointer tw-font-bold tw-[stroke-width:2] tw-ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  onRefetch && onRefetch();
                }}
              />
            </Tooltip>
          )}

          <div className="tw-mt-10 tw-text-center">
            <Status text={status} className="tw-mx-auto" />
          </div>

          <ul className="tw-space-y-3 tw-px-5 tw-pb-5 tw-mt-6">
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Account Number:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {lastFourDigits}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Routing Number:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {routing_number || "N/A"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Bank Name:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {bank_name || "N/A"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Bank Status:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {bankStatus || "N/A"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Account Holder Name:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {account_holder_name || "N/A"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Email:
              </Paragraph>
              <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
                {email || "N/A"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Charges Enabled:
              </Paragraph>
              <Paragraph
                className={`tw-text-sm ${
                  charges_enabled ? "tw-text-green" : "tw-text-red-500"
                } tw-font-medium`}
              >
                {charges_enabled ? "Yes" : "No"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                Payouts Enabled:
              </Paragraph>
              <Paragraph
                className={`tw-text-sm ${
                  payouts_enabled ? "tw-text-green" : "tw-text-red-500"
                } tw-font-medium`}
              >
                {payouts_enabled ? "Yes" : "No"}
              </Paragraph>
            </li>
            <li className="tw-flex tw-justify-between tw-items-center">
              <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
                {default_currency?.toUpperCase() || "N/A"}
              </Paragraph>
            </li>
          </ul>

          {!isComplete && (
            <Tooltip title="Show Required Fields">
              <Text
                type="danger"
                className="tw-rounded-3xl tw-py-2 tw-px-3 tw-w-fit tw-mx-auto tw-bg-gray-lighter tw-cursor-pointer tw-shadow-inner"
                onClick={() => setIsOpenRequiredFieldsModal(true)}
              >
                Required Fields
              </Text>
            </Tooltip>
          )}
        </div>
      )}

      {!isComplete && (
        <div className="tw-space-y-8">
          {(hasNoAccount || status === connectedAccountStatuses.IN_ACTIVE) && (
            <Paragraph className=" tw-px-4 tw-w-fit tw-mx-auto">
              {accountStatusMessage}
            </Paragraph>
          )}
          <div>
            <Button
              onClick={handleCompleteAccount}
              className="tw-mx-auto"
              loading={isLoading}
            >
              {hasNoAccount || status === connectedAccountStatuses.IN_ACTIVE
                ? "Create Account"
                : "Add Account Details"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;
