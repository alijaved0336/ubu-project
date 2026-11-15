import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  useCancelSubscriptionMutation,
  useCreateCheckoutSessionMutation,
  useGetAllSubscriptionsQuery,
} from "@src/store/api/subscriptionsApi";
import { STRIPE_URL } from "@src/utils/constant";
import { useSelector } from "react-redux";
import { notification } from "antd";
import PropTypes from "prop-types";
import { useRefreshTokenMutation } from "@src/store/api/authApi";
import SubscriptionCancelModal from "@src/components/Modals/SubscriptionCancelModal";
import SubscriptionCancelSuccessModal from "@src/components/Modals/SubscriptionCancelSuccessModal";

const SubscriptionContext = createContext();

const SubscriptionProvider = ({ children }) => {
  const {
    user: { isSubscribed, subscriptionInfo } = {
      isSubscribed: false,
      subscriptionInfo: [],
    },
    refreshToken: token,
  } = useSelector((state) => state.auth || {});

  const activeSubscription = useMemo(
    () => subscriptionInfo?.[0] ?? {},
    [subscriptionInfo]
  );

  const [isYearly, setIsYearly] = useState(false);
  const [subscribingId, setSubscribingId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const { isLoading, allSubscriptions, noSubscription } =
    useGetAllSubscriptionsQuery(undefined, {
      selectFromResult: ({ isError, isFetching, isLoading, data, status }) => ({
        isLoading: isLoading || isFetching,
        error: isError,
        noSubscription:
          status === "fulfilled" &&
          (!data?.data || (Array.isArray(data?.data) && !data?.data?.length)),
        allSubscriptions: (data?.data || [])
          ?.slice()
          ?.sort(
            (a, b) =>
              +a?.product?.metadata?.sr_no - +b?.product?.metadata?.sr_no
          ),
      }),
    });

  const [createCheckoutSession, { isLoading: isSubscribing }] =
    useCreateCheckoutSessionMutation();

  const [cancelSubscription, cancelResult] = useCancelSubscriptionMutation();

  const [refreshToken, refreshResult] = useRefreshTokenMutation();

  const planInterval = isYearly ? "year" : "month";

  const cancelOrRenewText = activeSubscription?.cancel_at_period_end
    ? "end"
    : "renew";

  const handleTogglePlanType = useCallback(
    (isChecked) => setIsYearly(isChecked),
    []
  );

  const handleOpenCancelSubscptionModal = useCallback((subscriptionId) => {
    setSubscribingId(subscriptionId);
    setIsOpen(true);
  }, []);

  const handleCloseCancelSubscptionModal = () => {
    setSubscribingId(null);
    setIsOpen(false);
  };

  const handleSubscribe = useCallback(
    async (subscriptionId, payload) => {
      setSubscribingId(subscriptionId);

      try {
        const { data } = await createCheckoutSession(payload).unwrap();
        if (data?.data) {
          if (isSubscribed && !data?.data?.includes(STRIPE_URL)) {
            notification.open({
              message: data.data,
              placement: "topRight",
              type: "info",
            });
          } else {
            window.location.href = data.data;
          }
        }
      } catch (error) {
        if (error && error?.message) {
          notification.open({
            message: error.message,
            placement: "topRight",
            type: "error",
          });
        }
      } finally {
        setSubscribingId(null);
      }
    },
    [createCheckoutSession, isSubscribed]
  );

  const handleCancelSubscription = async () => {
    try {
      const { data } = await cancelSubscription(subscribingId).unwrap();

      if (data?.statusCode === 402) {
        notification.open({
          message: data?.data,
          placement: "topRight",
          type: "error",
        });
      } else {
        await refreshToken(token).unwrap();

        setIsOpenSuccessModal(true);
      }
    } catch (error) {
      if (error && error?.response?.data) {
        notification.open({
          message: error?.response?.data,
          placement: "topRight",
          type: "error",
        });
      }
    } finally {
      setSubscribingId(null);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isSubscribed && activeSubscription?.interval === "year") {
      setIsYearly(true);
    }
  }, [isSubscribed, activeSubscription]);

  const value = useMemo(
    () => ({
      isYearly,
      isSubscribed,
      isSubscribing,
      subscribingId,
      activeSubscription,
      allSubscriptions,
      isLoadingSubscriptions: isLoading,
      noSubscription,
      planInterval,
      cancelOrRenewText,
      onOpenCancelSubscptionModal: handleOpenCancelSubscptionModal,
      onSubscribe: handleSubscribe,
      onTogglePlanType: handleTogglePlanType,
    }),
    [
      isYearly,
      isSubscribed,
      isSubscribing,
      subscribingId,
      activeSubscription,
      allSubscriptions,
      isLoading,
      noSubscription,
      planInterval,
      cancelOrRenewText,
      handleOpenCancelSubscptionModal,
      handleSubscribe,
      handleTogglePlanType,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      {isOpen && (
        <SubscriptionCancelModal
          isOpen={isOpen}
          isCancelling={cancelResult.isLoading || refreshResult.isLoading}
          onConfirm={handleCancelSubscription}
          onCancel={handleCloseCancelSubscptionModal}
        />
      )}
      {isOpenSuccessModal && (
        <SubscriptionCancelSuccessModal
          isOpen={isOpenSuccessModal}
          onCancel={() => setIsOpenSuccessModal(false)}
        />
      )}
    </SubscriptionContext.Provider>
  );
};

SubscriptionProvider.propTypes = {
  children: PropTypes.node,
};

export const useSubscription = () => {
  return useContext(SubscriptionContext) ?? {};
};

export default SubscriptionProvider;
