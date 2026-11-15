import ReviewSkeleton from "../ReviewSkeleton";

import { Flex, Skeleton } from "antd";

const BrandReviewCardSkeleton = () => {
  return (
    <Flex vertical>
      <Flex vertical gap={8} className="tw-w-full">
        <Skeleton.Button
          active
          size="large"
          style={{ width: "60%", height: 40 }}
        />
        <Flex vertical gap={8}>
          <Flex align="center" gap={30}>
            <Skeleton.Button
              active
              size="large"
              style={{ width: 100, height: 80 }}
            />
            <Skeleton.Button
              active
              size="small"
              style={{ width: 40, height: 40 }}
            />
          </Flex>
          <Skeleton.Button
            active
            size="small"
            style={{ width: "70%", height: 30 }}
          />
        </Flex>

        {/* <ReviewSkeleton /> */}
      </Flex>
    </Flex>
  );
};

export default BrandReviewCardSkeleton;
