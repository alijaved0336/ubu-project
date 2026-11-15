import PropTypes from "prop-types";
import CustomModal from "@src/components/Modals/CustomModal";

import { Button, Grid, Progress } from "antd";
import { Heading } from "@src/components/Common/Typography";
import ProfileCoverUploader from "../profile/ProfileCoverUploader";

const UpdateProfileCoverModal = ({
  title,
  isVisible,
  onClose,
  onSubmit,
  media,
  setMedia,
  isLoading,
  progress,
  showAvatar,
  setShowAvatar
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
      <ProfileCoverUploader media={media} setMedia={setMedia} enableResizer = {true} showAvatar={showAvatar} setShowAvatar={setShowAvatar}/>
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

UpdateProfileCoverModal.propTypes = {
  title: PropTypes.string,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  media: PropTypes.array,
  setMedia: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default UpdateProfileCoverModal;
