import React from "react";
import { Skeleton } from "antd";
import { StyledSubscriptionCard } from "./SubscriptionCard";

const SubscriptionCardSkeleton = () => {
  return (
    <StyledSubscriptionCard
      className="tw-w-[18.5rem] tw-min-h-[30.125rem] tw-border-t-2 tw-border-gray-light tw-rounded-none tw-py-5"
      title={
        <div className="tw-flex tw-flex-col tw-gap-y-4">
          <div className="tw-min-h-[8rem] tw-flex tw-flex-col tw-gap-y-2">
            {/* Icon and Title */}
            <div className="tw-flex tw-items-center tw-gap-x-2">
              <Skeleton.Avatar active size="default" shape="circle" />
              <Skeleton.Input active size="small" block />
            </div>
            {/* Description */}
            <Skeleton.Input active size="small" block />
            {/* Price */}
            <div className="tw-flex tw-items-center tw-gap-x-2">
              <Skeleton.Input active size="small" style={{ width: 20 }} />
            </div>
          </div>
          {/* Button */}
          <div className="tw-mb-6">
            <Skeleton.Button active block />
          </div>
        </div>
      }
    >
      {/* What's Included Section */}
      <div>
        <Skeleton.Input active size="small" style={{ width: 20 }} block />

        <ul className="tw-space-y-2 tw-mt-4">
          {Array(3)
            .fill()
            .map((_, idx) => (
              <li className="tw-flex tw-items-center tw-gap-2" key={idx}>
                <Skeleton.Avatar active size="small" shape="circle" />
                <Skeleton.Input active size="small" block />
              </li>
            ))}
        </ul>
      </div>
    </StyledSubscriptionCard>
  );
};

export default SubscriptionCardSkeleton;
