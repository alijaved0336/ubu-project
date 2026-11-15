import PropTypes from "prop-types";
import "./InfluencerCardStatsSkeleton.less";
import { Skeleton } from "antd";

const InfluencerCardStatsSkeleton = ({ calledFor }) => {
  return (
    <div className={`tw-flex tw-flex-col tw-gap-${calledFor == "ai" ? '7' : '1'} tw-flex-grow tw-w-2`}>
      <div className="tw-flex tw-w-full">
        <Skeleton.Button
          className="tw-flex-grow skeleton-rounded-border"
          active
          block
          style={{ height: 64 }}
        />
      </div>
      <div className="tw-flex tw-w-full tw-gap-2">
        <div className="tw-basis-1/2">
          <Skeleton.Button
            className="skeleton-rounded-border"
            active
            block
            style={{ height: 55 }}
          />
        </div>
        <div className="tw-basis-1/2">
          <Skeleton.Button
            className="skeleton-rounded-border"
            active
            block
            style={{ height: 55 }}
          />
        </div>
      </div>
      <div className="tw-flex tw-w-full tw-gap-2">
        <div className="tw-basis-1/2">
          <Skeleton.Button
            className="skeleton-rounded-border"
            active
            block
            style={{ height: 55 }}
          />
        </div>
        <div className="tw-basis-1/2">
          <Skeleton.Button
            className="skeleton-rounded-border"
            active
            block
            style={{ height: 55 }}
          />
        </div>
      </div>
    </div>
  );
};

InfluencerCardStatsSkeleton.propTypes = {
  calledFor: PropTypes.string,
};

export default InfluencerCardStatsSkeleton;
