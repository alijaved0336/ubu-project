import { Skeleton } from "antd";
import React from "react";

const AccountDetailsSkeleton = () => {
  return (
    <div className="tw-absolute tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="tw-ticket-edge tw-min-w-[30.375rem] tw-min-h-[315px] tw-rounded-xl tw-border tw-shadow-card tw-p-2 tw-flex tw-flex-col tw-justify-between">
        <div className="tw-bg-white tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-absolute tw-top-0 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
          <Skeleton.Avatar shape="circle" active size="large" />
        </div>
        <div className="tw-mt-6 tw-flex tw-flex-col tw-gap-1 tw-text-center tw-items-center ">
          {/* <Skeleton.Input active size="default" style={{ width: "20%" }} /> */}
          <Skeleton.Input active size="default" style={{ width: "20%" }} />
        </div>

        <ul className="tw-space-y-3 tw-px-5 tw-pb-5 tw-mt-6">
          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>
          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
            <Skeleton.Input active size="small" style={{ width: "20%" }} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountDetailsSkeleton;
