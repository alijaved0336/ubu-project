import { Paragraph } from "@src/components/Common/Typography";
import { useGetConnectedAccountDetailsQuery } from "@src/store/api/campaignPaymentApi";
import {
  accountInfoMessage,
  connectedAccountStatuses,
} from "@src/utils/constant";
import { Alert, List, Typography } from "antd";
import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useMemo } from "react";
import { useSelector } from "react-redux";

const { Text } = Typography;
const ConnectedAccountContext = createContext();

function generateAccountIncompleteMessage(requirements) {
  const { currently_due } = requirements;

  const messages = {
    "business_profile.mcc": "Business profile MCC code",
    "business_profile.product_description":
      "Business profile product description",
    "business_profile.support_phone": "Business profile support phone",
    "business_profile.url": "Business profile website URL",
    external_account: "Bank account details",
    "individual.address.city": "Individual's city address",
    "individual.address.line1": "Individual's address line 1",
    "individual.address.postal_code": "Individual's postal code",
    "individual.address.state": "Individual's state address",
    "individual.dob.day": "Individual's date of birth (day)",
    "individual.dob.month": "Individual's date of birth (month)",
    "individual.dob.year": "Individual's date of birth (year)",
    "individual.email": "Individual's email address",
    "individual.first_name": "Individual's first name",
    "individual.last_name": "Individual's last name",
    "individual.phone": "Individual's phone number",
    "individual.ssn_last_4": "Last 4 digits of individual’s SSN",
    "settings.payments.statement_descriptor":
      "Payment settings (statement descriptor)",
    "tos_acceptance.date": "Acceptance of the Terms of Service (date)",
    "tos_acceptance.ip": "Acceptance of the Terms of Service (IP address)",
  };

  const missingFields = currently_due.map((field) => messages[field] || field);
  const message = `
      Your account is incomplete and requires additional information to proceed. Please provide the following details:
      - ${missingFields.join("\n- ")}
      Once these details are provided, your account will be ready for use.
    `;
  return (
    <div>
      <Alert
        message={
          <Paragraph>Your account requires additional information</Paragraph>
        }
        description={
          <div className="tw-mt-2">
            <List
              // bordered
              dataSource={missingFields}
              renderItem={(item) => (
                <List.Item className="tw-py-2">
                  <Paragraph className="tw-text-sm">{item}</Paragraph>
                </List.Item>
              )}
            />
          </div>
        }
        type="warning"
        showIcon
        className="tw-text-left tw-border tw-border-yellow-400 tw-bg-yellow-50 tw-rounded-lg tw-font-manrope"
      />
    </div>
  );
}

const ConnectedAccountProvider = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const {
    isLoading,
    accountDetails,
    status: apiCallStatus,
    isError,
    error,
    refetch,
  } = useGetConnectedAccountDetailsQuery(undefined, {
    selectFromResult: ({
      isError,
      isFetching,
      isLoading,
      data,
      status,
      error,
    }) => ({
      isLoading: isLoading || isFetching,
      isError: isError,
      error,
      accountDetails: data?.data?.data ?? {},
      status,
    }),
    skip: !isAuthenticated || user?.type === "brand",
    refetchOnMountOrArgChange: true,
  });

  const { accountInfo, updatedConnectedAccount } = accountDetails ?? {};

  const hasNoAccount =
    apiCallStatus === "fulfilled" &&
    (!accountDetails || Object.keys(accountDetails).length === 0);

  const {
    email,
    charges_enabled,
    payouts_enabled,
    default_currency,
    external_accounts,
    requirements,
  } = accountInfo ?? {};

  const bankAccount = external_accounts?.data?.[0] || {};
  const {
    bank_name,
    last4,
    account_holder_name,
    routing_number,
    status: bankStatus,
  } = bankAccount;

  const lastFourDigits = last4 ? `****${last4}` : "N/A";

  const status = updatedConnectedAccount?.status || "in-active";

  const reasonKey =
    requirements?.currently_due?.[0] || requirements?.disabled_reason || status;

  const accountStatusMessage = useMemo(() => {
    return accountInfoMessage[reasonKey] ? (
      <Alert
        message={
          reasonKey !== connectedAccountStatuses.IN_ACTIVE ? (
            <Paragraph>Your account requires additional information</Paragraph>
          ) : (
            <Paragraph>{accountInfoMessage[reasonKey]}</Paragraph>
          )
        }
        description={
          reasonKey !== connectedAccountStatuses.IN_ACTIVE ? (
            <div className="tw-mt-2">{accountInfoMessage[reasonKey]}</div>
          ) : null
        }
        type="warning"
        showIcon
        className="tw-text-left tw-border tw-rounded-lg tw-font-manrope"
      />
    ) : (
      generateAccountIncompleteMessage(requirements)
    );
  }, [reasonKey, requirements]);

  const isStripeVerifying = reasonKey === "requirements.pending_verification";

  const isComplete =
    requirements?.alternatives?.length === 0 &&
    requirements?.current_deadline === null &&
    requirements?.currently_due.length === 0 &&
    requirements?.disabled_reason === null &&
    requirements?.errors?.length === 0 &&
    requirements?.eventually_due?.length === 0 &&
    requirements?.past_due?.length === 0 &&
    requirements?.pending_verification?.length === 0;

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  const value = useMemo(
    () => ({
      apiCallStatus,
      isComplete,
      reasonKey,
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
      accountStatusMessage,
      isStripeVerifying,
      isLoadingConnectedAccountDetails: isLoading,
      connectedAccountDetailsHasError: isError,
      connectedAccountDetailsError: error,

      onRefetch: handleRefetch,
    }),
    [
      isComplete,
      reasonKey,
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
      accountStatusMessage,
      isStripeVerifying,
      isLoading,
      isError,
      error,
      apiCallStatus,
      handleRefetch,
    ]
  );

  return (
    <ConnectedAccountContext.Provider value={value}>
      {children}
    </ConnectedAccountContext.Provider>
  );
};

ConnectedAccountProvider.propTypes = {
  children: PropTypes.node,
};

export const useConnectedAccount = () => {
  return useContext(ConnectedAccountContext) ?? {};
};

export default ConnectedAccountProvider;
