import { memo } from "react";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import { notification } from "antd";
import PropTypes from "prop-types";
import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";
import { useDeletePostMutation } from "@src/store/api/postsApi";

const DeletePostModal = ({ isOpen, onCancel, onConfirm, postId }) => {
  const [deletePost, { isLoading }] = useDeletePostMutation();
  console.log({ postId });
  const handleDeletePost = async () => {
    try {
      await deletePost(postId).unwrap();

      notification.success({
        message: "Success",
        description: "The post has been successfully deleted.",
      });
      onConfirm && onConfirm();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message || "Faled to release funds",
      });
    }
  };

  return (
    <CustomModal
      title={null}
      width="500px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-items-center tw-gap-3 tw-justify-center">
          <Button
            className="tw-w-full"
            type="secondary"
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleDeletePost}
            loading={isLoading}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope tw-text-center">
        <WarningIconWithShadow width="54" height="54" className="tw-mx-auto" />

        <Heading level={5} className="tw-font-bold">
          Are you sure you want to delete this Post?
        </Heading>
      </div>
    </CustomModal>
  );
};

DeletePostModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(DeletePostModal);
