import PropTypes from "prop-types";

import { Flex, Skeleton } from "antd";

const SkeletonSection = ({ children }) => (
  <Flex vertical gap={10}>
    <Flex className={`tw-w-1/5`}>
      <Skeleton.Button block active />
    </Flex>
    <Flex>
      {children}
    </Flex>
  </Flex>
);

SkeletonSection.propTypes = {
  children: PropTypes.node,
};


const CampaignViewSkeleton = () => {
  return (
    <Flex vertical gap={12}>
      {/* +++++++++++++++++++ */}
      <Flex className="tw-justify-between tw-mb-4">
        <Flex className="tw-w-1/12">
          <Skeleton.Button block active />
        </Flex>
        <Flex className="tw-w-3/12 tw-justify-between" gap={10}>
          <Skeleton.Button block active />
        </Flex>
      </Flex>

      {/* +++++++++++++++++++ */}
      <Flex className="tw-justify-between" gap={20}>
        {/* Left Column */}
        <Flex vertical className="tw-w-full" gap={10}>
          {Array(6).fill(null).map((_, index) => (
            <SkeletonSection key={index}>
              <Skeleton.Button block active />
            </SkeletonSection>
          ))}
        </Flex>

        {/* +++++++++++++++++++++++++++++++++++++++++++ */}
        {/* Right Column */}
        <Flex vertical className="tw-w-full" gap={10}>
          <SkeletonSection width="1/5">
            <Skeleton.Button block active />
          </SkeletonSection>
          <Flex className="tw-w-full tw-h-full">
            <Skeleton.Button block active style={{ height: "100%" }} />
          </Flex>
        </Flex>
      </Flex>

      <Flex className="tw-justify-between" gap={20}>
        {/* Left Column */}
        <Flex vertical className="tw-w-full" gap={10}>
          {Array(3).fill(null).map((_, index) => (
            <SkeletonSection key={index}>
              <Skeleton.Button block active />
            </SkeletonSection>
          ))}
        </Flex>

        {/* +++++++++++++++++++++++++++++++++++++++++++ */}
        {/* Right Column */}
        <Flex vertical className="tw-w-full" gap={10}>
          <SkeletonSection width="1/5">
            <Skeleton.Button block active />
          </SkeletonSection>
          <Flex className="tw-w-1/5">
            <Skeleton.Button block active />
          </Flex>
          <Flex className="tw-w-full tw-h-full">
            <Skeleton.Button block active style={{ height: "100%" }} />
          </Flex>
        </Flex>
      </Flex>

      {/* +++++++++++++++++++++++++++++++++++++++++++ */}
      <Flex vertical className="tw-w-1/2" gap={10}>
        <SkeletonSection width="1/5">
          <Skeleton.Button block active />
        </SkeletonSection>
        <Flex className="tw-w-52 tw-h-36">
          <Skeleton.Button block active style={{ height: "100%" }} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CampaignViewSkeleton;
