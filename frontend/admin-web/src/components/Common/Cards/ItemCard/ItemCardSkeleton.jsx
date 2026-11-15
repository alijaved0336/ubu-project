import React from "react";
import { Skeleton } from "antd";
import { StyledItemCard } from "./ItemCard";

const ItemCardSkeleton = () => {
  return (
    <StyledItemCard
      style={{ width: "100%" }}
      className="tw-max-w-md tw-min-h-[500px]"
      cover={
        <div className="tw-p-[1px]">
          <Skeleton.Image
            rootClassName="!tw-w-full"
            className="!tw-w-full tw-rounded-lg tw-aspect-square"
            style={{ height: "100%", width: "100%" }}
            active
          />
        </div>
      }
    >
      <div className="tw-space-y-4 tw-p-4 tw-mt-4">
        <Skeleton.Input active size="small" style={{ width: 20 }} />
        <div className="tw-space-y-3">
          <Skeleton.Input active size="small" style={{ width: "100%" }} block />
          <Skeleton.Input active size="small" style={{ width: "100%" }} block />
          <Skeleton.Input active size="small" style={{ width: "100%" }} block />
          <Skeleton.Input active size="small" style={{ width: "100%" }} block />
        </div>
      </div>
    </StyledItemCard>
  );
};

export default ItemCardSkeleton;
