import "./PostIndexSkeleton.less";

import { Flex, Skeleton } from "antd";

const PostIndexSkeleton = () => {
  const count = 4;
  return (
    <Flex className="tw-flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <Flex key={index} className="skeleton-card">
          <Skeleton.Button block active size="large" style={{ height: 130 }} />
        </Flex>
      ))}
    </Flex>
  );
};

export default PostIndexSkeleton;
