import PropTypes from "prop-types";
import { Flex, Skeleton, Alert } from "antd";

const SkeletonSection = ({ width }) => (
  <Flex vertical gap={10}>
    <Skeleton.Input style={{ width: width || "100%" }} active />
  </Flex>
);

SkeletonSection.propTypes = {
  width: PropTypes.string,
};

const CampaignPublishSkeleton = () => {
  return (
    <div className="main-publish-container tw-relative">
      <Alert type="warning" showIcon style={{ marginBottom: "16px" }} />

      <div className="top-bar tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center">
          <Skeleton.Input style={{ width: "200px" }} active />
        </div>
        <div className="publish-button-group">
          <Flex className="tw-flex tw-gap-2 tw-justify-end ">
            <Skeleton.Button style={{ width: 100 }} active />
            <Skeleton.Button style={{ width: 100 }} active />
            <Skeleton.Button style={{ width: 100 }} active />
          </Flex>
        </div>
      </div>

      <div className="campaign-container tw-flex tw-gap-4">
        <div className="campaign-left">
          <div className="campaign-content tw-gap-14">
            <SkeletonSection />
            <Skeleton.Input style={{ height: 190, width: "100%" }} active />
            <SkeletonSection />
          </div>
        </div>

        <div className="campaign-right">
          <div className="campaign-publish-document tw-h-48">
            <Flex className="tw-flex-col">
              <Skeleton.Input style={{ height: 160, width: "100%" }} active />
            </Flex>
          </div>
          <div className="campaign-publish-document tw-h-48">
            <Flex className="tw-gap-10 tw-flex-col">
              <Skeleton.Image style={{ height: 160, width: "100%" }} active />
            </Flex>
          </div>
          <div className="campaign-publish-document tw-h-48">
            <Flex className="tw-gap-6 tw-flex-col">
              <SkeletonSection />
              <SkeletonSection />
              <SkeletonSection />
            </Flex>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPublishSkeleton;
