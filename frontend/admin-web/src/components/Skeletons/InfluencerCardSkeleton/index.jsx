import PropTypes from "prop-types";
// import "./InfluencerCardSkeleton.less";

import { Flex, Skeleton } from "antd";

const InfluencerCardSkeleton = ({ isAiInluencersLoading }) => {
  return (
    <div className="influencer-card">
      <div className="col col-1 tw-flex tw-flex-col tw-items-center tw-gap-2">
        <div className="avatar-wrapper">
          <Skeleton.Avatar
            block
            shape="circle"
            size="large"
            active
            style={{ width: "130px", height: "130px" }}
          />
        </div>

        <Skeleton.Input className="influencer-name" size="small" />

        <div className="tw-flex tw-gap-2">
          <Skeleton.Avatar shape="square" size="small" active />
          <Skeleton.Input size="small" />
        </div>
      </div>

      {isAiInluencersLoading && (
        <div className="col col-2 ">
          <div className="tw-flex tw-gap-3 xs:tw-flex-col sm:tw-flex-row">
            <div className="tw-basis-1/2 tw-space-y-2">
              <Skeleton.Avatar
                block
                shape="circle"
                size="large"
                active
                className="tw-flex-grow"
                style={{ width: "85px", height: "85px" }}
              />

              <div className="tw-flex-grow tw-space-y-2">
                <div className="tw-flex tw-gap-2 tw-items-center">
                  <Skeleton.Avatar shape="circle" size="default" active />
                  <Skeleton.Input className="label" size="small" />
                </div>

                <div className="tw-flex tw-gap-2 tw-items-center">
                  <Skeleton.Avatar shape="circle" size="default" active />
                  <Skeleton.Input className="label" size="small" />
                </div>
                <div className="tw-flex tw-gap-2 tw-items-center">
                  <Skeleton.Avatar shape="circle" size="default" active />
                  <Skeleton.Input className="label" size="small" />
                </div>
              </div>
            </div>

            <div className="tw-flex-grow tw-space-y-2 xs:tw-self-start sm:tw-self-end">
              <div className="tw-flex tw-gap-2 tw-items-center">
                <Skeleton.Avatar block shape="circle" size="default" active />
                <Skeleton.Input className="label" size="small" />
              </div>

              <div className="tw-flex tw-gap-2 tw-items-center">
                <Skeleton.Avatar block shape="circle" size="default" active />
                <Skeleton.Input className="label" size="small" />
              </div>

              <div className="tw-flex tw-gap-2 tw-items-center">
                <Skeleton.Avatar block shape="circle" size="default" active />
                <Skeleton.Input className="label" size="small" />
              </div>

              <div className="tw-flex tw-gap-2 tw-items-center">
                <Skeleton.Avatar block shape="circle" size="default" active />
                <Skeleton.Input className="label" size="small" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="col col-3">
        <Skeleton.Node block active style={{ width: "100%", height: "62px" }} />

        <Flex className="stats-row">
          <Skeleton.Node
            active
            rootClassName=""
            className="tw-basis-1/2"
            style={{
              width: "100%",
              height: "62px",
            }}
          />

          <Skeleton.Node
            active
            className="tw-basis-1/2"
            style={{ width: "100%", height: "62px" }}
          />
        </Flex>
        <Flex className="stats-row">
          <Skeleton.Node
            active
            className="tw-basis-1/2"
            style={{ width: "100%", height: "62px" }}
          />
          <Skeleton.Node
            active
            className="tw-basis-1/2"
            style={{ width: "100%", height: "62px" }}
          />
        </Flex>
      </div>

      <div className="col col-5 ">
        <Skeleton.Button
          // className="influencer-button"
          style={{ height: "58px", width: "100%" }}
          block
          active
        />
        <Skeleton.Button
          // className="influencer-button"
          style={{ height: "58px", width: "100%" }}
          block
          active
        />
        <Skeleton.Button
          // className="influencer-button"
          style={{ height: "58px", width: "100%" }}
          block
          active
        />
      </div>
    </div>
  );
};

InfluencerCardSkeleton.propTypes = {
  isAiInluencersLoading: PropTypes.bool.isRequired,
};

export default InfluencerCardSkeleton;
