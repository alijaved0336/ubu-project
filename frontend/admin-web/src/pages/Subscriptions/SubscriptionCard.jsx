import React, { memo, useMemo } from "react";
import cn from "@src/cn";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";

import { Card } from "antd";
import PropTypes from "prop-types";
import styled from "styled-components";
import { PlanIcon, TickIcon } from "@src/assets/icons";
import { getFormattedDate, getPrice } from "@src/utils/helpers";
import { useSelector } from "react-redux";
import { useSubscription } from "@src/components/Providers/SubscriptionsProvider";

const success_url = import.meta.env.VITE_FRONTEND_SUBSCRIPTION_SUCCESS_URL;
const cancel_url = import.meta.env.VITE_FRONTEND_SUBSCRIPTION_CANCEL_URL;

export const StyledSubscriptionCard = styled(Card)`
  .ant-card-head .ant-card-head-title {
    white-space: normal;
    font-weight: normal;
  }
`;

const icons = {
  basic: <PlanIcon />,
  enterprise: <PlanIcon fill="#F79E1B" />,
  professional: <PlanIcon />,
};

const SubscriptionCard = ({
  id,
  title,
  description,
  features,
  subscriptionBtnText,
  planType,
  prices,
  isSubscribing = false,
  disabled = false,
}) => {
  const { planInterval, onOpenCancelSubscptionModal, onSubscribe } =
    useSubscription();

  const intervalAbbr = planInterval === "month" ? "/mo" : "/yr";
  const { isSubscribed, subscriptionInfo } = useSelector(
    (state) => state.auth?.user || {}
  );
  const selectedPrice = useMemo(() => {
    return prices?.find((p) => p?.recurring?.interval === planInterval) ?? {};
  }, [prices, planInterval]);

  const { currentActivePlan } = useMemo(() => {
    const currentActivePlan = subscriptionInfo?.[0] ?? {};

    return { currentActivePlan };
  }, [subscriptionInfo]);

  const cancelledPlan = useMemo(() => {
    return subscriptionInfo?.find(
      (sub) =>
        sub?.product_id === id &&
        sub?.price_id === selectedPrice?.id &&
        sub?.cancel_at_period_end
    );
  }, [subscriptionInfo, selectedPrice, id]);

  const isCancelled = cancelledPlan ? true : false;

  const isCurrentPlanActive =
    isSubscribed &&
    id === currentActivePlan?.product_id &&
    selectedPrice?.id === currentActivePlan?.price_id;

  const isActivePlanCancelled =
    isCurrentPlanActive && currentActivePlan?.cancel_at_period_end;

  return (
    <StyledSubscriptionCard
      className={cn(
        "tw-max-w-[18.5rem] tw-min-h-[30.125rem] tw-border-t-2 tw-border-gray-light tw-rounded-none tw-py-5 tw-border-t-gray-navy",
        {
          "tw-border-t-orange": planType === "enterprise",
        }
      )}
      title={
        <div className="tw-flex tw-flex-col tw-gap-y-4">
          <div className="tw-min-h-[8rem] tw-flex tw-flex-col tw-justify-between">
            <div className="tw-flex tw-items-center tw-gap-x-[10px]">
              {icons[planType] ?? <PlanIcon />}
              <Heading level={4}>{title}</Heading>
            </div>
            <Paragraph className="tw-text-[#666] tw-text-sm">
              {description}
            </Paragraph>
            {selectedPrice && (
              <div className="tw-flex tw-items-center tw-gap-1">
                <Heading level={2} className="tw-font-bold">
                  {getPrice({
                    amount: selectedPrice?.unit_amount,
                    isStripePrice: true,
                  })}
                </Heading>
                <Paragraph className="tw-text-gray-medium !tw-text-sm tw-font-medium">
                  {intervalAbbr}
                </Paragraph>
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-justify-between tw-min-h-20">
            <Button
              type="primary"
              className=" tw-font-medium tw-w-full"
              onClick={() =>
                onSubscribe(id, {
                  price: selectedPrice?.id,
                  success_url,
                  cancel_url,
                })
              }
              loading={isSubscribing}
              disabled={disabled || isCurrentPlanActive || isCancelled}
            >
              {isCurrentPlanActive ? (
                <div className="tw-flex tw-justify-center tw-items-center tw-gap-1">
                  <TickIcon fill="rgba(0, 0, 0, 0.25)" />
                  <span>Current Plan</span>
                </div>
              ) : (
                subscriptionBtnText
              )}
            </Button>
            <>
              {isCancelled && !isCurrentPlanActive && (
                <Paragraph className="tw-text-xs tw-font-medium tw-tracking-wider tw-text-red-500 tw-text-center tw-cursor-pointer">
                  Inactive until{" "}
                  {getFormattedDate(
                    cancelledPlan?.subs_end_date ?? "",
                    "MMMM D, YYYY"
                  )}
                </Paragraph>
              )}
              {isCurrentPlanActive && !isActivePlanCancelled && (
                <Paragraph
                  className="tw-text-xs tw-font-semibold tw-text-orange  tw-text-center tw-cursor-pointer"
                  onClick={() =>
                    onOpenCancelSubscptionModal(
                      currentActivePlan?.stripe_subscription_id
                    )
                  }
                >
                  Cancel Subscription
                </Paragraph>
              )}
              <div />
            </>
          </div>
        </div>
      }
    >
      <p className="tw-text-[#111827] tw-text-[0.75rem] tw-font-semibold">
        WHAT’S INCLUDED
      </p>
      <ul className="tw-space-y-2 tw-mt-4">
        {features?.map(({ name }, idx) => (
          <li className="tw-flex !tw-mb-0 tw-items-baseline tw-gap-2" key={idx}>
            <div>
              <TickIcon />
            </div>
            <Paragraph className="tw-text-gray-dark tw-text-sm">
              {name}
            </Paragraph>
          </li>
        ))}
      </ul>
    </StyledSubscriptionCard>
  );
};

SubscriptionCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  features: PropTypes.array,
  subscriptionBtnText: PropTypes.string,
  planPrice: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
  prices: PropTypes.array,
  planType: PropTypes.oneOf(["basic", "professional", "enterprise"]),
  isSubscribing: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default memo(SubscriptionCard);
