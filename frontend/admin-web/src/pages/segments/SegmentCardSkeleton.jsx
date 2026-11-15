import { Skeleton } from "antd";
import "./SegmentCard.less";

import "react-loading-skeleton/dist/skeleton.css";

import { Flex } from "antd";
import { Text } from "@src/components";

const SegmentCardSkeleton = () => {
  return (
    <div className="segment-card">
      <Flex vertical className="segment-content">
        <div className="segment-section-header tw-mb-4">
          <Text className="tw-flex tw-gap-3 fs-20 fw-700  ">
            <Skeleton.Input size="default" />
            <Skeleton.Node
              className="!tw-p-0"
              active
              style={{ height: "100%", width: "35px" }}
            />
          </Text>
          <div className="segment-actions">
            <Skeleton.Node
              className="!tw-p-0"
              active
              style={{ height: "100%", width: "35px" }}
            />
          </div>
        </div>
        <Flex className="segment-details">
          <Skeleton.Node
            className="segment-detail !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="segment-detail !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="segment-detail !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="segment-detail !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="segment-detail !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
        </Flex>
      </Flex>
    </div>
  );
};

export default SegmentCardSkeleton;
