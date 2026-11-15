import { Flex, Skeleton } from "antd";

const CampaignEditSkeleton = () => {
  return (
    <Flex vertical gap={30}>
      <Flex className="tw-justify-between" gap={20}>
        <Flex vertical className="tw-w-full" gap={30}>
          <Flex vertical gap={10}>
            <Flex className="tw-w-1/5">
              <Skeleton.Button block active />
            </Flex>
            <Flex>
              <Skeleton.Button block active />
            </Flex>
          </Flex>

          <Flex vertical gap={10}>
            <Flex className="tw-w-1/5">
              <Skeleton.Button block active />
            </Flex>
            <Flex>
              <Skeleton.Button block active />
            </Flex>
          </Flex>
        </Flex>

        <Flex vertical className="tw-w-full" gap={30}>
          <Flex vertical gap={10}>
            <Flex className="tw-w-1/5">
              <Skeleton.Button block active />
            </Flex>
            <Flex>
              <Skeleton.Button block active />
            </Flex>
          </Flex>

          <Flex vertical gap={10}>
            <Flex className="tw-w-1/5">
              <Skeleton.Button block active />
            </Flex>
            <Flex>
              <Skeleton.Button block active />
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical gap={10}>
        <Flex className="tw-w-full" gap={10}>
          <Flex className="tw-w-10/12">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
          <Flex className="tw-w-1/12">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
          <Flex className="tw-w-1/12">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
        </Flex>

        <Flex className="tw-w-full">
          <Skeleton.Button block active className="tw-w-full" />
        </Flex>
      </Flex>

      <Flex gap={10}>
        <Flex vertical className="tw-w-full" gap={10}>
          <Flex className="tw-w-1/12">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
          <Flex className="tw-w-full">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
        </Flex>
      </Flex>

      <Flex gap={10}>
        <Flex vertical className="tw-w-full" gap={10}>
          <Flex className="tw-w-1/12">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
          <Flex className="tw-w-full">
            <Skeleton.Button block active className="tw-w-full" />
          </Flex>
        </Flex>
      </Flex>

      <Flex className="tw-w-full tw-h-44">
        <Skeleton.Button block active style={{ height: "100%" }} />
      </Flex>
    </Flex>
  );
};

export default CampaignEditSkeleton;
