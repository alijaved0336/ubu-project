import PropTypes from "prop-types";
import BlogCoverUploader from "./BlogCoverUploader";
import CustomModal from "@src/components/Modals/CustomModal";

import { Button, Grid, Progress } from "antd";
import { Heading } from "@src/components/Common/Typography";
import ProfileCoverUploader from "../profile/ProfileCoverUploader";

const UpdateBlogCoverModal = ({
  title,
  isVisible,
  onClose,
  onSubmit,
  media,
  setMedia,
  isLoading,
  progress,
}) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return (
    <CustomModal
      title={
        <Heading level={2} className="tw-font-manrope">
          {title}
        </Heading>
      }
      isOpen={isVisible}
      onCancel={onClose}
      width={screens.xs ? "80%" : screens.sm ? "50%" : "30%"}
      footer={
        <div className="tw-flex tw-justify-center">
          <Button loading={isLoading} onClick={onSubmit}>
            Submit
          </Button>
        </div>
      }
    >
      <BlogCoverUploader media={media} setMedia={setMedia} enableResizer = {true}/>
      {progress > 0 && (
        <Progress
          percent={progress}
          percentPosition={{ align: "center", type: "outer" }}
          size="small"
          status={progress === 100 ? "normal" : "active"}
          strokeColor="#000"
        />
      )}
    </CustomModal>
  );
};

UpdateBlogCoverModal.propTypes = {
  title: PropTypes.string,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  media: PropTypes.array,
  setMedia: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default UpdateBlogCoverModal;
