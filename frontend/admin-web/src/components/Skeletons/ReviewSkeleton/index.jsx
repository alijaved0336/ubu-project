import { Skeleton, Flex } from "antd";

const ReviewSkeleton = () => {
  return (
    <Flex gap={12} vertical>
      <Flex align="center" justify="space-between" className="tw-w-full" gap={4}>
        <Flex gap={4}>
          <Flex>
            <Skeleton.Avatar active size={60} shape="circle" />
          </Flex>
          <Flex gap={2} className="tw-flex-col tw-justify-between tw-py-1">
            <Skeleton.Button active size="small" style={{ width: 120, height: 16 }} />
            <Skeleton.Button active size="small" style={{ width: 120, height: 16 }} />
          </Flex>
        </Flex>
        <Flex align="center" className="tw-w-full tw-justify-end" gap={4}>
          <Skeleton.Button active size="small" style={{ width: 120, height: 16 }} />
        </Flex>
      </Flex>
      <Flex vertical gap={4}>
        <Skeleton.Button size="small" block active />
        <Skeleton.Button size="small" block active />
        <Skeleton.Button size="small" block active />
      </Flex>
    </Flex>
  );
};

export default ReviewSkeleton;
