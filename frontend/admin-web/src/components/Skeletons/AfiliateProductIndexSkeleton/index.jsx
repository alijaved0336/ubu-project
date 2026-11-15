import "./AfiliateProductIndexSkeleton.less";

import { Flex, Skeleton } from "antd";

const AfiliateProductIndexSkeleton = () => {
  const count = 4;
  return (
    <Flex className="tw-flex-col tw-px-2">
      {Array.from({ length: count }).map((_, index) => (
        <Flex key={index} className="afiliate-skeleton-card">
          <Skeleton.Button block active size="large" style={{ height: 200 }} />
        </Flex>
      ))}
    </Flex>
  );
};

export default AfiliateProductIndexSkeleton;
