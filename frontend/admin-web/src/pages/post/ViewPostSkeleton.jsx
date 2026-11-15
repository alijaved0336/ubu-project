import ItemCardSkeleton from "@src/components/Common/Cards/ItemCard/ItemCardSkeleton";
import { StyledViewPostCard } from "./ViewPost";
import { Skeleton } from "antd";

const ViewPostSkeleton = () => {
  return (
    <div className="tw-mb-8 tw-space-y-5">
      <StyledViewPostCard
        style={{ width: "100%" }}
        className="hover:tw-shadow-avatar tw-transition-all tw-duration-150 tw-w-full tw-p-4"
      >
        <div className="tw-flex tw-justify-end tw-items-center tw-mb-4">
          <Skeleton.Avatar shape="circle" size="default" />
        </div>
        <div className="tw-grid lg:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5 tw-font-manrope">
          <div>
            <div className="tw-max-h-max ">
              <Skeleton.Image
                rootClassName="!tw-w-full !tw-block tw-mx-auto "
                className="!tw-w-full  tw-rounded-lg  tw-max-w-[600px] lg:!tw-h-[450px]  !tw-h-[250px]"
              />
            </div>
          </div>
          <div>
            <div className="tw-space-y-3 tw-mt-4">
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "100%" }}
                block
              />
            </div>
            <div className="tw-space-y-4 tw-mt-4">
              <Skeleton.Input
                active
                size="small"
                style={{ width: "50%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "50%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "50%" }}
                block
              />
              <Skeleton.Input
                active
                size="small"
                style={{ width: "50%" }}
                block
              />
            </div>
          </div>
        </div>
      </StyledViewPostCard>
      <div className="tw-grid lg:tw-grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] tw-grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] md:tw-justify-items-start tw-justify-items-center tw-gap-8  ">
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
        <ItemCardSkeleton />
      </div>
    </div>
  );
};

export default ViewPostSkeleton;
