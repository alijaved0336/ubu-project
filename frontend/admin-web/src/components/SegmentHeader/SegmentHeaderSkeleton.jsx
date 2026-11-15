import "./SegmentHeader.less";

import { Skeleton } from "antd";
import { useSelector } from "react-redux";
import cn from "@src/cn";

const SegmentHeaderSkeleton = () => {
  const { isSidebarCollapsed } = useSelector((state) => state.settings || {});
  return (
    <div
      className={cn("segment-header", {
        collapsed: isSidebarCollapsed,
        "not-collapsed": !isSidebarCollapsed,
      })}
    >
      <div className="brand-logo">
        <Skeleton.Avatar
          block
          shape="square"
          size="large"
          active
          style={{ width: "150px", height: "150px" }}
        />
      </div>
      <div className="campaign-summary">
        <Skeleton.Input size="default" />

        <div className="summary-cards">
          <Skeleton.Node
            className="summary-card !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="summary-card !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />

          <Skeleton.Node
            className="summary-card !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />

          <Skeleton.Node
            className="summary-card !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SegmentHeaderSkeleton;
