import { Flex, Skeleton } from "antd";

const BrandInfoCardSkeleton = () => {
  return (
    <Flex vertical className="tw-w-full" gap={12}>
      <Flex className="tw-justify-between tw-w-full">
        <Flex align="center" gap={16}>
          <Skeleton.Avatar active size={90} shape="circle" />
          <Flex className="tw-w-full">
            <Skeleton.Button active size="large" style={{ width: "30%" }} />
          </Flex>
        </Flex>
      </Flex>
      <Flex
        vertical
        style={{ width: "100%" }}
        gap={12}
        className="profile-details"
      >
        <Skeleton.Button active size="small" style={{ width: "20%" }} />
        <Flex vertical align="center" gap={12}>
          <Skeleton.Button block active size="small" />
          <Skeleton.Button block active size="small" />
          <Skeleton.Button block active size="small" />
        </Flex>
        <Flex gap={12}>
          <Skeleton.Button active size="small" className="tw-w-24" />
          <Skeleton.Button active size="small" className="tw-w-24" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default BrandInfoCardSkeleton;
