import PropTypes from "prop-types";
import axiosInstance from "@src/application-wide/axios/axios-instance";

import { Flex } from "antd";
import { useState } from "react";
import { CustomButton } from "@src/components";
import { useNavigate } from "react-router-dom";
import { isSuccess } from "@src/utils/responseHelpers";
import { showNotification } from "@src/utils/showNotification";

const BlogActionButtons = ({ blog, isLoading, allowActions = true }) => {
  const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const onDeleteClick = async (id) => {
      try {
        setIsDeleting(true);
        const response = await axiosInstance.delete(`/blog/${id}`);
        if (isSuccess(response.status)) {
          showNotification({
            notificationType: "success",
            message: "Blog Deleted Successfully",
            description: "Blog has been deleted",
          });
          navigate(`/dashboard/blogs`);
        } else {
          showNotification({
            notificationType: "error",
            message: "Something went wrong",
            description: "Blog could not be deleted",
          });
        }
      } catch (error) {
        showNotification({
          notificationType: "error",
          message: "Something went wrong",
          description: "Blog could not be deleted",
        });
        console.error("Error adding post:", error);
      } finally {
        setIsDeleting(false);
      }
    };

    return (
      <Flex className="tw-justify-end tw-my-4 tw-gap-2 tw-flex-wrap">
        <CustomButton variant={"light"} onClick={() => navigate(-1)}>
          Back
        </CustomButton>
        {(allowActions && !isLoading) && (
          <CustomButton
            variant={"light"}
            onClick={() => navigate(`/dashboard/blogs/edit/${blog.id}`)}
          >
            Edit
          </CustomButton>
        )}
        {(allowActions && !isLoading) && (
          <CustomButton
            disabled={isDeleting}
            loading={isDeleting}
            variant={"light"}
            onClick={() => onDeleteClick(blog.id)}
          >
            Delete
          </CustomButton>
        )}
      </Flex>
    );
  };

  BlogActionButtons.propTypes = {
    blog: PropTypes.object,
    isLoading: PropTypes.bool,
    allowActions: PropTypes.bool,
  };

export default BlogActionButtons