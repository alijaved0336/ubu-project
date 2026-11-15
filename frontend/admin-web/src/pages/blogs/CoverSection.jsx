import PropTypes from "prop-types";
import CameraIcon from "@src/assets/icons/CameraIcon";

import { Skeleton, Tooltip } from "antd";

const CoverSection = ({
  blog,
  postLoading,
  onEditCoverClick,
  allowActions,
}) => {
  if (postLoading) {
    return (
      <Skeleton.Button
        active
        block
        style={{
          height: "240px",
        }}
      />
    );
  }

  const hasMedia = blog?.media?.length > 0;
  const backgroundStyle = hasMedia
    ? {
        backgroundImage: `url(${blog.media[0].url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        backgroundColor: "#F9F9FC",
      };

  return (
    <div
      className="tw-flex tw-justify-between"
      style={{
        ...backgroundStyle,
        height: "240px",
        width: "100%",
        position: "relative",
        backgroundRepeat: "no-repeat",
      }}
    >
      {!hasMedia && (
        <>
          <div
            style={{
              borderTopLeftRadius: "10px",
              backgroundColor: "rgba(30, 30, 30, 0.3)",
              clipPath: "polygon(0 0, 90% 0, 100% 100%, 0 100%)",
            }}
            className="tw-w-2/3"
          />
          <div
            style={{
              borderTopRightRadius: "10px",
              backgroundColor: "rgba(30, 30, 30, 0.14)",
              clipPath: "polygon(0% 0, 100% 0, 100% 100%, 20% 100%)",
            }}
            className="tw-w-1/3"
          />
        </>
      )}

      {allowActions && (
        <Tooltip title="Update Cover">
          <div
            className="action-icon tw-absolute tw-top-3 tw-right-3 tw-cursor-pointer"
            onClick={onEditCoverClick}
          >
            <CameraIcon />
          </div>
        </Tooltip>
      )}
    </div>
  );
};

CoverSection.propTypes = {
  blog: PropTypes.object,
  postLoading: PropTypes.bool,
  onEditCoverClick: PropTypes.func,
  allowActions: PropTypes.bool,
};

export default CoverSection;
