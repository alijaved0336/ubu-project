import cn from "@src/cn";
import { Skeleton } from "antd";
import PropTypes from "prop-types";
import React from "react";

const TransactionsSummaryCardSkeleton = ({ className }) => {
  return (
    <div className={cn("tw-space-y-3  tw-text-center", className)}>
      <Skeleton.Input active size="small" style={{ width: "70%" }} block />
      <Skeleton.Input active size="default" style={{ width: "30%" }} block />
    </div>
  );
};

TransactionsSummaryCardSkeleton.propTypes = {
  className: PropTypes.string,
};
export default TransactionsSummaryCardSkeleton;
