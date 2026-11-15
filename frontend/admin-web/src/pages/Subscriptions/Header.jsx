import React, { memo } from "react";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { useSubscription } from "@src/components/Providers/SubscriptionsProvider";
import { capitalize, getFormattedDate, getPrice } from "@src/utils/helpers";
import { Switch } from "@src/components/Common/Widgets";

const Header = () => {
  const {
    isSubscribed,
    isSubscribing,
    isYearly,
    activeSubscription,
    cancelOrRenewText,
    onTogglePlanType,
  } = useSubscription();

  return (
    <div className="tw-flex tw-gap-3 tw-flex-col">
      <Heading level={3} className="!tw-font-bold">
        Plans
      </Heading>
      {isSubscribed && (
        <Paragraph className="!tw-text-sm tw-text-black-60 tw-max-w-[768px]">
          This workspace’s {capitalize(activeSubscription?.plan_type ?? "")}{" "}
          Plan is set to{" "}
          {getPrice({
            amount: activeSubscription?.price,
            isStripePrice: true,
          }) ?? ""}
          per {activeSubscription?.interval ?? ""} and will {cancelOrRenewText}{" "}
          on{" "}
          {getFormattedDate(
            activeSubscription?.subs_end_date ?? "",
            "MMMM D, YYYY"
          )}
          .
        </Paragraph>
      )}

      <div className="tw-flex tw-gap-2 tw-mt-3">
        <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
          Monthly
        </Paragraph>
        <Switch
          isChecked={isYearly}
          onChange={onTogglePlanType}
          disabled={isSubscribing}
        />
        <Paragraph className="tw-text-gray-dark tw-text-sm tw-font-medium">
          Annualy
        </Paragraph>
        <Paragraph className="tw-text-orange tw-text-sm tw-font-medium">
          (-20%)
        </Paragraph>
      </div>
    </div>
  );
};

export default memo(Header);
