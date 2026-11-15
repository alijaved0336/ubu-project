import React, { memo } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { useSubscription } from "@src/components/Providers/SubscriptionsProvider";
import NoData from "@src/components/NoData";
import SubscriptionCardSkeleton from "./SubscriptionCardSkeleton";

const SubscriptionList = () => {
  const {
    subscribingId,
    isSubscribing,
    allSubscriptions,
    isLoadingSubscriptions,
    noSubscription,
  } = useSubscription();

  if (noSubscription)
    return <NoData isMessage message="No Subscription Available." />;

  if (isLoadingSubscriptions)
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-[1.25rem]">
        <SubscriptionCardSkeleton />
        <SubscriptionCardSkeleton />
        <SubscriptionCardSkeleton />
      </div>
    );

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-[1.25rem]">
      {allSubscriptions?.map(
        ({
          product: { id, name, description, marketing_features, metadata },
          price,
        }) => (
          <SubscriptionCard
            key={id}
            id={id}
            title={name}
            isSubscribing={id === subscribingId && isSubscribing}
            disabled={isSubscribing}
            description={description}
            features={marketing_features}
            prices={price}
            planType={metadata?.plan_type}
            subscriptionBtnText="Subscribe"
          />
        )
      )}
    </div>
  );
};

export default memo(SubscriptionList);
