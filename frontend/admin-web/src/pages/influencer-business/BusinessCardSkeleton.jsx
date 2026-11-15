import { Skeleton } from "antd";
import React from "react";

const BusinessCardSkeleton = () => {
  return (
    <div className="brand-card">
      <div className="card-column">
        <Skeleton.Avatar
          block
          shape="circle"
          size="large"
          active
          // className="card-column"
          rootClassName=""
          style={{ width: "150px", height: "150px" }}
        />
        <Skeleton.Input className="brand-name" size="small" />
      </div>

      <Skeleton.Node
        className="description-column !tw-p-0"
        size="large"
        active
        style={{ minHeight: "100%", width: "100%" }}
      />

      <div className="stats-column ">
        <div className="stats-column-row full-width">
          <Skeleton.Node
            block
            active
            size="large"
            className="industry-column !tw-p-0"
            style={{ minHeight: "100%", width: "100%" }}
          />
        </div>

        <div className="stats-column-row half-width">
          <Skeleton.Node
            className="category-column !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
          <Skeleton.Node
            className="audience-column !tw-p-0"
            size="large"
            active
            style={{ minHeight: "100%", width: "100%" }}
          />
        </div>
      </div>

      <div className="influencer-buttons-column">
        <Skeleton.Button style={{ height: "38px" }} block active />
        <Skeleton.Button style={{ height: "38px" }} block active />
        <Skeleton.Button style={{ height: "38px" }} block active />
      </div>
    </div>
  );
};

export default BusinessCardSkeleton;
