import { useEffect, useState } from "react";
import AccountCreationModal from "@src/components/Campaign/CampaignPayment/AccountCreationModal";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
import {
  useGetInfluencerInfoQuery,
  useUpdateAccountModalStatusMutation,
} from "@src/store/api/influencersApi";

import { connectedAccountStatuses } from "@src/utils/constant";
import AccountCompletionModal from "@src/components/Campaign/CampaignPayment/AccountCompletionModal";

const StripeAccountVerification = () => {
  const {
    accountStatusMessage,
    status: currentAccountStatus,
    isComplete,
    apiCallStatus,
  } = useConnectedAccount();

  const [
    isOpenCreateConnectedAccountModal,
    setIsOpenCreateConnectedAccountModal,
  ] = useState(false);

  const [updateAccountModalStatus] = useUpdateAccountModalStatusMutation();

  const { influencer } = useGetInfluencerInfoQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      influencer: data ?? {},
      loading: isLoading || isFetching,
    }),
    skip: isComplete,
    refetchOnMountOrArgChange: true,
  });

  const isOpenAccountCreationModal =
    !isComplete &&
    apiCallStatus === "fulfilled" &&
    isOpenCreateConnectedAccountModal &&
    currentAccountStatus === connectedAccountStatuses.IN_ACTIVE;

  const isOpenAccountCompletionModal =
    !isComplete &&
    apiCallStatus === "fulfilled" &&
    isOpenCreateConnectedAccountModal &&
    currentAccountStatus !== connectedAccountStatuses.IN_ACTIVE;

  const handleClose = () => {
    setIsOpenCreateConnectedAccountModal(false);
    updateAccountModalStatus();
  };

  useEffect(() => {
    if (influencer && influencer?.is_show_modal) {
      setIsOpenCreateConnectedAccountModal(influencer?.is_show_modal);
    }
  }, [influencer]);

  return (
    <>
      {isOpenAccountCreationModal && (
        <AccountCreationModal
          isOpen={isOpenAccountCreationModal}
          onCancel={handleClose}
          onConfirm={handleClose}
        />
      )}
      {isOpenAccountCompletionModal && (
        <AccountCompletionModal
          isOpen={isOpenAccountCompletionModal}
          message={accountStatusMessage}
          onCancel={handleClose}
          onConfirm={handleClose}
        />
      )}
    </>
  );
};

export default StripeAccountVerification;
